import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300">404</h1>
        <p className="text-xl text-gray-600 mt-4">Página não encontrada</p>
        <Link to="/" className="mt-6 inline-block bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700">
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
