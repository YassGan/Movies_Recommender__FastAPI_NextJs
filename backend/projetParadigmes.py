import numpy as np
from scipy.linalg import svd

# Matrice d'évaluations utilisateurs (les évaluations manquantes sont représentées par des zéros)
R = np.array([
    [5, 4, 0, 3, 5],
    [0, 5, 5, 0, 4],
    [4, 0, 4, 5, 0],
    [3, 4, 0, 5, 4],
    [0, 0, 5, 4, 5]
])

# Application de SVD
U, sigma, VT = svd(R, full_matrices=False)

# Convertir sigma en une matrice diagonale
Sigma = np.diag(sigma)

# Nombre de caractéristiques à conserver
n_features = 3
U = U[:, :n_features]
Sigma = Sigma[:n_features, :n_features]
VT = VT[:n_features, :]

# Prédiction des évaluations (approximation de R)
R_pred = np.dot(np.dot(U, Sigma), VT)

print("Matrice des évaluations prédites :")
print(R_pred)

# Trouver et afficher les évaluations prédites pour les entrées manquantes
for i in range(R.shape[0]):
    for j in range(R.shape[1]):
        if R[i, j] == 0:
            print(f"Évaluation prédite pour l'utilisateur {i+1} et le film {j+1} : {R_pred[i, j]:.2f}")
