import React from "react";
import { Link } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <AlertTriangle className="h-24 w-24 text-gray-400 mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Page non trouvée
          </h2>
          <p className="text-gray-600 mb-8">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Retour à l'accueil</span>
          </Link>

          <div className="text-sm text-gray-500">
            <p>Vous pouvez aussi essayer :</p>
            <div className="mt-2 space-x-4">
              <Link to="/" className="text-blue-600 hover:underline">
                Recherche d'adresses
              </Link>
              <Link to="/companies" className="text-blue-600 hover:underline">
                Recherche d'entreprises
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
