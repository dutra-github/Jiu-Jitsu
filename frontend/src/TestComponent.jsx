export default function TestComponent() {
  console.log('TestComponent renderizando!')
  
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'red', 
      color: 'white',
      fontSize: '24px',
      minHeight: '100vh'
    }}>
      <h1>TESTE - Se você está vendo isso, o React está funcionando!</h1>
      <p>Timestamp: {new Date().toISOString()}</p>
    </div>
  )
}
