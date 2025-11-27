import AIAgent from '../components/AIAgent/AIAgent';

export default function Indicadores() {
  return (
    <div className="indicadores-page">
      <h1>Indicadores</h1>
      
      <div className="indicadores-content">
        <AIAgent />
        
        {/* Outros componentes de indicadores podem ser adicionados aqui */}
      </div>
    </div>
  );
}
