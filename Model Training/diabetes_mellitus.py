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
from imblearn.over_sampling import SMOTE, RandomOverSampler, BorderlineSMOTE, SVMSMOTE, KMeansSMOTE
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score, GridSearchCV, StratifiedShuffleSplit

df = pd.read_csv("./diabetes_mellitus.csv")

# PREPARATION
X_features = ['pregnancy_count', 'plasma_glucose_concentration', 'diastolic_blood_pressure', 'triceps_skin_fold_thickness', 'two_hour_insulin', 'bmi', 'diabetes_pedigree_function', 'age']
y_target = 'diabetes_mellitus'

unique_target = df[y_target].unique()
diabetes_mellitus_dfs = {}
for value in unique_target:
  diabetes_mellitus_dfs[value] = df[df[y_target] == value]

df_1 = diabetes_mellitus_dfs[1]
df_0 = diabetes_mellitus_dfs[0]

X  = df[X_features]
y = df[y_target]

X_1  = df_1[X_features]
y_1 = df_1[y_target]
X_0  = df_0[X_features]
y_0 = df_0[y_target]

sss = StratifiedShuffleSplit(n_splits=1, test_size=268, random_state=42)
for train_index, test_index in sss.split(X_0, y_0):
    X_0 = X_0.iloc[test_index]
    y_0 = y_0.iloc[test_index]

X = pd.concat([X_1, X_0], ignore_index=True)
y = pd.concat([y_1, y_0], ignore_index=True)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.4, random_state=42)

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
    'kernel': ['linear']
}

svm = SVC(random_state=42)

grid = GridSearchCV(svm, params)

grid.fit(X_train, y_train)

best_params = grid.best_params_

print('\nBest Params:')
print(best_params)

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
with open('diabetes_mellitus_model.pkl', 'wb') as f:
    dump(pipeline, f)