/** Home.jsx — landing page */
export default function Home(){
  return (
    <div className="container">
      <div className="panel">
        <h2>Welcome to Dog Adoption</h2>
        <p>Register or log in to list dogs for adoption, browse all dogs, adopt with optional Food Bank selection, and track your adoptions.</p>
        <ul>
          <li>🔐 JWT Auth (register/login)</li>
          <li>📋 List your dogs, remove if not adopted</li>
          <li>🐕 View all dogs, adopt (can’t adopt own / already adopted)</li>
          <li>🍽️ Food Bank — choose food during adoption (stock-aware)</li>
        </ul>
      </div>
    </div>
  );
}
