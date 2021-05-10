from flask import Flask
app = Flask(__name__, static_url_path='/static')

from flask import render_template, json, jsonify, Response, request
from apscheduler.schedulers.background import BackgroundScheduler

import os
import sys
import re
import requests
import pandas as pd
import numpy as np

# own helper functions
from python_scripts.utils import *
from python_scripts.generator import *

# initialize the generator
gen = interview_generator()


# # # # # # # # #
# API REQUESTS  #
# # # # # # # # #

def imitate_live_soccer_stat_api():

    # grab current path
    path_new = os.path.dirname(__file__)

    # grab paths for (imitating) API and database CSVs
    api_url = os.path.join(path_new, "static/data", "2018-19__match_infos_with_grades_and_summary_translated_cleaned.csv")
    db_url = os.path.join(path_new, "static/database", "database.csv")

    # grab random sample (imitating a game that's coming in from the live soccer stat API)
    random_sample = pd.read_csv(api_url).sample()

    # => include model predictions here

    # write to db
    random_sample.to_csv(db_url, mode='a', header=False, index=False)




# start scheduler
scheduler = BackgroundScheduler(daemon=True)
scheduler.add_job(imitate_live_soccer_stat_api,'interval',seconds=15)
scheduler.start()


# # # # # #
# ROUTES  #
# # # # # #


# render index
@app.route('/')
def render_index(name=None):
    return render_template('index.html', name=name)

# send processed data upon request
@app.route('/filterData', methods = ['POST'])
def send_corpus_json():

    """1) read request"""
    # get the request info
    filters_bytes = request.data
    filters_string = filters_bytes.decode('utf-8')
    filters_dict = json.loads(filters_string)['filters']

    # sanity check
    print(filters_dict, file=sys.stderr)

    """2) load data"""
    # grab current path
    path_new = os.path.dirname(__file__)

    # file names
    file_names = [
        '2018-19__match_infos_with_grades_and_summary_translated_cleaned.csv',
        '2019-20__match_infos_with_grades_and_summary_translated_cleaned.csv']

    all_dfs_from_csv = []

    # load
    for name in file_names:
        url = os.path.join(path_new, "static/data", name)
        all_dfs_from_csv.append(pd.read_csv(url))

    df_final = pd.concat(all_dfs_from_csv, axis=0, ignore_index=True)

    # clean data
    df_final = df_final[df_final['interview_home_english'] != 'NOTFOUND']
    df_final['interview_home_english'] = df_final['interview_home_english'].apply(lambda x: x.lower())
    df_final['interview_away_english'] = df_final['interview_away_english'].apply(lambda x: x.lower())

    df = df_final

    """3) filter"""
    all_helper_series = []
    for key in  filters_dict:
        helper_series = build_series_pair(df, key, filters_dict)
        all_helper_series.append(helper_series)

    prior_series = all_helper_series[0]
    final_locs = ''
    for i, series in enumerate(all_helper_series):

        if i==0:
            final_locs = series
        else:
            final_locs = final_locs & prior_series

        prior_series = series

    filtered_df = df.loc[final_locs]

    """4) final cleaning"""

    # delete punctuation and generate cols with tokens
    filtered_df['interview_home_english_as_tokens'] = filtered_df['interview_home_english'].apply(lambda x: x.replace('.','').replace(',','').split(' '))
    filtered_df['interview_away_english_as_tokens'] = filtered_df['interview_away_english'].apply(lambda x: x.replace('.','').replace(',','').split(' '))

    # generate cols with no stop words
    filtered_df['interview_home_english_as_tokens_no_stopwords'] = filtered_df['interview_home_english_as_tokens'].apply(lambda x: exclude_stopwords(x))
    filtered_df['interview_away_english_as_tokens_no_stopwords'] = filtered_df['interview_away_english_as_tokens'].apply(lambda x: exclude_stopwords(x))

    # convert to usable data structure
    df_dict = filtered_df.to_dict('records')

    # jsonify
    data = jsonify(df_dict)

    # return
    return data


# send latest 10 predictions upon request
@app.route('/latest-predictions', methods = ['GET'])
def send_latest_predictions():

    # grab current path
    path_new = os.path.dirname(__file__)

    # get db url (csv used instead temporarily)
    url = os.path.join(path_new, "static/database/database.csv")

    # load db
    df_database_of_predictions = pd.read_csv(url)

    list_of_last_ten_predictions = df_database_of_predictions.tail(10).to_dict('records')

    # sanity check
    #print(list_of_last_ten_predictions, file=sys.stderr)

    # convert to json object
    data = jsonify(list_of_last_ten_predictions)

    # send
    return data


# send processed data upon request
@app.route('/get-prediction', methods = ['POST'])
def prediction_interview():

    """1) read request"""
    # get the request info
    stats_bytes = request.data
    stats_string = stats_bytes.decode('utf-8')
    stats_dict = json.loads(stats_string)['stats']

    # sanity check
    print(stats_dict, file=sys.stderr)

    # set match grade to 2 -> doesn't have a big impact for the logistic regression model anyhow
    stats_dict['grade'] = 2

    home_team_dict = stats_dict
    home_team_dict['is_home_team'] = True

    # build away_dict
    away_team_dict = {
        'score_home': home_team_dict['score_away'],
        'score_away': home_team_dict['score_home'],
        'shots_home': home_team_dict['shots_away'],
        'shots_away': home_team_dict['shots_home'],
        'passes_home':home_team_dict['passes_away'],
        'passes_away':home_team_dict['passes_home'],
        'misplaced_passes_home':home_team_dict['misplaced_passes_away'],
        'misplaced_passes_away':home_team_dict['misplaced_passes_home'],
        'pass_accuracy_home':home_team_dict['pass_accuracy_away'],
        'pass_accuracy_away':home_team_dict['pass_accuracy_home'],
        'distance_home':home_team_dict['distance_away'],
        'distance_away':home_team_dict['distance_home'],
        'grade':home_team_dict['grade'],
        'is_home_team':False
    }


    generated_interview_home = gen.generate_interview(home_team_dict)
    generated_interview_away = gen.generate_interview(away_team_dict)

    generated_interviews = {'generated_interview_home': generated_interview_home, 'generated_interview_away':generated_interview_away}

    final = {'stats': stats_dict, 'interviews': generated_interviews}
    # convert to json object
    data = jsonify(final)

    # send
    return data



if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, use_reloader=False)