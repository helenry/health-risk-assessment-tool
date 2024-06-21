# IMPORTS
import numpy as np
import pandas as pd

from pickle import dump
from sklearn.svm import SVC
from sklearn.pipeline import Pipeline
from sklearn.feature_selection import RFE
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, f1_score
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score, GridSearchCV, StratifiedShuffleSplit

df = pd.read_csv("./heart_diseases.csv")

# CLEANING
df['gender'] = df['gender'].replace({
    'Male': 0,
    'Female': 1
}).astype(np.uint8)

df['age_category'] = df['age_category'].replace({
    '18-24': 0,
    '25-29': 1,
    '30-34': 2,
    '35-39': 3,
    '40-44': 4,
    '45-49': 5,
    '50-54': 6,
    '55-59': 7,
    '60-64': 8,
    '65-69': 9,
    '70-74': 10,
    '75-79': 11,
    '80 or older': 12
}).astype(np.uint8)

df['race'] = df['race'].replace({
    'White': 0,
    'Hispanic': 1,
    'Black': 2,
    'Asian': 3,
    'American Indian/Alaskan Native': 4,
    'Other': 5
}).astype(np.uint8)

df['general_health'] = df['general_health'].replace({
    'Poor': 0,
    'Fair': 1,
    'Good': 2,
    'Very good': 3,
    'Excellent': 4
}).astype(np.uint8)

df['diabetic'] = df['diabetic'].replace({
    'No': 0,
    'Yes': 1,
    'No, borderline diabetes': 2,
    'Yes (during pregnancy)': 3
}).astype(np.uint8)

df = df.replace({'Yes': 1, 'No': 0})

# PREPARATION
X_features = ['bmi', 'smoking', 'drank_alcohol', 'stroke', 'physical_health', 'mental_health', 'walking_difficulty', 'gender', 'age_category', 'race', 'diabetic', 'physical_activity', 'general_health', 'sleep_time', 'asthma', 'kidney_disease', 'skin_cancer']
y_target = 'heart_disease'

unique_target = df['heart_disease'].unique()
heart_disease_dfs = {}
for value in unique_target:
  heart_disease_dfs[value] = df[df['heart_disease'] == value]

df_1 = heart_disease_dfs[1]
df_0 = heart_disease_dfs[0]

X_1  = df_1[X_features]
y_1 = df_1[y_target]
X_0  = df_0[X_features]
y_0 = df_0[y_target]

sss = StratifiedShuffleSplit(n_splits=1, test_size=2500, random_state=42)
for train_index, test_index in sss.split(X_1, y_1):
    X_1 = X_1.iloc[test_index]
    y_1 = y_1.iloc[test_index]
for train_index, test_index in sss.split(X_0, y_0):
    X_0 = X_0.iloc[test_index]
    y_0 = y_0.iloc[test_index]

X = pd.concat([X_1, X_0], ignore_index=True)
y = pd.concat([y_1, y_0], ignore_index=True)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.4, random_state=42)

estimator = LogisticRegression(random_state=42)
selector = RFE(estimator, n_features_to_select=13, step=1)

selector.fit(X_train, y_train)
selected_features = X.columns[selector.ranking_ == 1]

X_train = X_train[selected_features]
X_test = X_test[selected_features]

print('Selected Features:')
print(selected_features)

# TRAINING
pipeline = Pipeline(steps=[
    ('scale', StandardScaler()),
    ('SVM', SVC(random_state=42))
])

pipeline.fit(X_train, y_train)

k_fold = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
accuracy_cross_validation = cross_val_score(pipeline, X, y, cv=k_fold, scoring='accuracy')
f1_score_cross_validation = cross_val_score(pipeline, X, y, cv=k_fold, scoring='f1')

print("\nCross-Validation Accuracies:", accuracy_cross_validation)
print("Average Cross-Validation Accuracy:", accuracy_cross_validation.mean())
print("Cross-Validation F1 Scores:", f1_score_cross_validation)
print("Average Cross-Validation F1 Score:", f1_score_cross_validation.mean())

train_prediction = pipeline.predict(X_train)
test_prediction = pipeline.predict(X_test)

print('\nTrain Data')
print('Classification Report:')
print(classification_report(y_train, train_prediction))

print('Accuracy: ', accuracy_score(y_train, train_prediction))
print('F1 Score: ', f1_score(y_train, train_prediction))

print('\nTest Data')
print('Classification Report:')
print(classification_report(y_test, test_prediction))

print('Accuracy: ', accuracy_score(y_test, test_prediction))
print('F1 Score: ', f1_score(y_test, test_prediction))

# OPTIMIZATION
params = {
    'C': np.arange(1, 10, 1),
    'gamma': [0.00001, 0.00005, 0.0001, 0.0005, 0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5],
    'kernel': ['linear', 'rbf']
}

svm = SVC(random_state=42)

grid = GridSearchCV(svm, params)

grid.fit(X_train, y_train)

best_params = grid.best_params_

print('\nBest Params:')
print(best_params)

pipeline = Pipeline(steps=[
    ('scale', StandardScaler()),
    ('SVM', SVC(C=best_params['C'], gamma=best_params['gamma'], kernel=best_params['kernel'], random_state=42))
])

pipeline.fit(X_train, y_train)

print('\nTUNED MODEL')

k_fold = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
accuracy_cross_validation = cross_val_score(pipeline, X, y, cv=k_fold, scoring='accuracy')
f1_score_cross_validation = cross_val_score(pipeline, X, y, cv=k_fold, scoring='f1')

print("\nCross-Validation Accuracies:", accuracy_cross_validation)
print("Average Cross-Validation Accuracy:", accuracy_cross_validation.mean())
print("Cross-Validation F1 Scores:", f1_score_cross_validation)
print("Average Cross-Validation F1 Score:", f1_score_cross_validation.mean())

train_prediction = pipeline.predict(X_train)
test_prediction = pipeline.predict(X_test)

print('\nTrain Data')
print('Classification Report:')
print(classification_report(y_train, train_prediction))

print('Accuracy: ', accuracy_score(y_train, train_prediction))
print('F1 Score: ', f1_score(y_train, train_prediction))

print('\nTest Data')
print('Classification Report:')
print(classification_report(y_test, test_prediction))

print('Accuracy: ', accuracy_score(y_test, test_prediction))
print('F1 Score: ', f1_score(y_test, test_prediction))

# EXPORT
with open('heart_diseases_model.pkl', 'wb') as f:
    dump(pipeline, f)