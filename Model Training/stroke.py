# IMPORTS
import numpy as np
import pandas as pd

from pickle import dump
from sklearn.svm import SVC
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report, f1_score
from imblearn.over_sampling import SMOTE, RandomOverSampler, BorderlineSMOTE, SVMSMOTE, KMeansSMOTE
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score, GridSearchCV, StratifiedShuffleSplit

df = pd.read_csv("./stroke.csv")

# CLEANING
df = df.drop('id', axis=1)

df = df.dropna()

df.drop(df[df['gender'] == 'Other'].index, inplace=True)

df['ever_married'] = df['ever_married'].replace({
    'No': 0,
    'Yes': 1
}).astype(np.uint8)

df['gender'] = df['gender'].replace({
    'Male': 0,
    'Female': 1
}).astype(np.uint8)

df['residence_type'] = df['residence_type'].replace({
    'Rural': 0,
    'Urban': 1
}).astype(np.uint8)

df['work_type'] = df['work_type'].replace({
    'Private': 0,
    'Self-employed': 1,
    'Govt_job': 2,
    'children': 3,
    'Never_worked': 4
}).astype(np.uint8)

df['smoking_status'] = df['smoking_status'].replace({
    'Unknown': 0,
    'formerly smoked': 1,
    'smokes': 2,
    'never smoked': 3
}).astype(np.uint8)

# PREPARATION
X_features = ['gender', 'age', 'hypertension', 'heart_disease', 'ever_married', 'work_type', 'residence_type', 'average_glucose_level', 'bmi', 'smoking_status']
y_target = 'stroke'

unique_target = df['stroke'].unique()
stroke_dfs = {}
for value in unique_target:
  stroke_dfs[value] = df[df['stroke'] == value]

df_1 = stroke_dfs[1]
df_0 = stroke_dfs[0]

X  = df[X_features]
y = df[y_target]

X_1  = df_1[X_features]
y_1 = df_1[y_target]
X_0  = df_0[X_features]
y_0 = df_0[y_target]

sss = StratifiedShuffleSplit(n_splits=1, test_size=209, random_state=42)
for train_index, test_index in sss.split(X_0, y_0):
    X_0 = X_0.iloc[test_index]
    y_0 = y_0.iloc[test_index]

X = pd.concat([X_1, X_0], ignore_index=True)
y = pd.concat([y_1, y_0], ignore_index=True)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# # TRAINING
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

print('Train Data')
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
    'kernel': ['linear']
}

svm = SVC(random_state=42)

grid = GridSearchCV(svm, params)

grid.fit(X_train, y_train)

best_params = grid.best_params_

print('\nBest Params:')
print(best_params)

print('Best Score:')
print(grid.best_score_)

pipeline = Pipeline(steps=[
    ('scale', StandardScaler()),
    ('SVM', SVC(C=best_params['C'], kernel=best_params['kernel'], random_state=42))
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
with open('stroke_model.pkl', 'wb') as f:
    dump(pipeline, f)