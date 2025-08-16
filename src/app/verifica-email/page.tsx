import Link from 'next/link';

export default function VerificaEmailPage() {
  return (
    <div className="max-w-xl mx-auto bg-white border border-gray-200 rounded-lg p-6 mt-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifica la tua email</h1>
      <p className="text-gray-700 mb-4">
        Ti abbiamo inviato un&apos;email con un link di conferma. Clicca il link per attivare il tuo account.
      </p>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
        <li>Controlla anche la cartella Spam/Promozioni.</li>
        <li>Se non trovi l&apos;email dopo qualche minuto, prova a reinviare dal form di login.</li>
      </ul>
      <Link href="/" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Torna alla Home</Link>
    </div>
  );
}


