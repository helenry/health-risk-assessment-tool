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
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score, GridSearchCV

df = pd.read_csv("./heart_attack.csv")

# PREPARATION
X  = df[['age', 'gender', 'chest_pain_type', 'resting_blood_pressure', 'cholesterol', 'fasting_blood_sugar', 'resting_electrocardiographic_result', 'maximum_heart_rate_achieved', 'exercise_induced_angina', 'previous_peak', 'slope', 'major_coronary_arteries_number', 'thalium_stress_test_result']]
y = df['heart_attack']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

estimator = LogisticRegression(random_state=42)
selector = RFE(estimator, n_features_to_select=9, step=1)

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

# EXPORT
with open('heart_attack_model.pkl', 'wb') as f:
    dump(pipeline, f)

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