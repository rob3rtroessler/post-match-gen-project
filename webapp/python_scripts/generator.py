# import the necessary libraries
import string
import pickle
import numpy as np
import pandas as pd

# specific machine learning functionality
from sklearn.linear_model import LogisticRegression


class interview_generator():
    def __init__(self):
        # GPT2
        self.df = pd.read_csv('model/model_replacement.csv')

        # Logistical Model
        self.log_model = pickle.load(open('model/log1', 'rb'))
        self.x_columns = ['shots_home', 'shots_away', 'passes_home', 'passes_away',
                          'misplaced_passes_home', 'misplaced_passes_away', 'pass_accuracy_home',
                          'pass_accuracy_away', 'distance_home', 'distance_away', 'grade', 'is_home_team']

    def get_expected_result(self, row):
        x = [row[a] for a in self.x_columns]

        # Get the win probability
        y = self.log_model.predict_proba([x])[0][2]

        # Return the labels
        if y < 0.2:
            return "dominant loss"
        if y < 0.4:
            return "regular loss"
        if y < 0.6:
            return "tie"
        if y < 0.8:
            return "regular win"
        return "dominant win"

    @staticmethod
    def get_actual_result(row):
        home_goals = int(row['score_home'])
        away_goals = int(row['score_away'])
        diff = home_goals - away_goals
        if diff < -2:
            return "dominant loss"
        if diff < 0:
            return "regular loss"
        if diff == 0:
            return "tie"
        if diff < 3:
            return "regular win"
        return "dominant win"

    def generate_interview(self, row):
        actual = interview_generator.get_actual_result(row)
        expected = self.get_expected_result(row)
        cur_interviews = self.df[(self.df['actual_result'] == actual) & (self.df['expected_result'] == expected)]['interview'].values
        g = np.random.choice(cur_interviews)
        return g
