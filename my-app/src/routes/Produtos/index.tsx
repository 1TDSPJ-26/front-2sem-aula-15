// 1. Ferramentas do React
import { useState, useEffect, useRef } from 'react';

// 2. O molde que criamos
import { type Produto } from '../../types/produto';

import { Link, useNavigate } from 'react-router';
import { CiEdit as Editar } from "react-icons/ci";
import { MdDelete as Excluir} from "react-icons/md";

export default function Produtos() {
  // Muda o título da página
  document.title = "Produtos";
  // Criando o redirecionador
  const navigate = useNavigate();
  // Criamos o estado "produtos". 
  // - Ele começa vazio: []
  // - Avisamos ao TypeScript que ele vai guardar uma lista de TipoProduto: <TipoProduto[]>
  const [produtos, setProdutos] = useState<Produto[]>([]);
  // Ref para o dialog para o produto que será deletado:
  const dialogRef = useRef<HTMLDialogElement>(null);
  // State para o dialog para o produto que será deletado:
  const [idExclusivo, setIdExclusivo] = useState<string>("");

  const abrirModal = (id:string)=>{
    setIdExclusivo(id);
    dialogRef.current?.showModal();
  }

  useEffect(() => {
  const carregaProdutos = async () => {
    try{
      const response = await fetch("http://localhost:3001/produtos")
      if (!response.ok){
        throw new Error (`Falha na requisição dos produtos... ${response.status} - ${response.statusText}`)
      }
      const data:Produto[] = await response.json();
      console.log(data)
      setProdutos(data)
    } catch (error) {
      console.error(error)
    } 
  }
  carregaProdutos();
  }, []);

  const handleDelete = async(idExclusivo:string) => {
    try {
      const response = await fetch(`http://localhost:3001/produtos/${idExclusivo}`, {
        method: "DELETE",
      });
      if (!response.ok){
        throw new Error (`Falha na deleção do produto... ${response.status} - ${response.statusText}`)
      }
      alert("Produto excluído com sucesso")
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Painel de Produtos</h1>
      <dialog ref={dialogRef} style={{ padding: "20px", borderRadius: "8px", border: "1px solid #ccc" }}>
        <h3>Confirmar exclusão de produto</h3>
        <p>Tem certeza que deseja excluir o produto</p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "15px" }}>
          <button onClick={()=>dialogRef.current?.close()} style={{ background: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}>Cancelar Exclusão</button>
          <button onClick={()=>handleDelete} style={{ background: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}>Excluir</button>
        </div>
      </dialog>
      <p>Confira abaixo a lista de itens cadastrados no sistema:</p>

      {/* Tabela com borda e espaçamento para ficar fácil de ler */}
      <table border={1} cellPadding={10} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        
        {/* Cabeçalho da Tabela */}
        <thead>
          <tr style={{ backgroundColor: '#dcdf40', color: '#000000' }}>
            <th>Foto</th>
            <th>ID</th>
            <th>Nome</th>
            <th>Preço</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>

        {/* Corpo da Tabela com a repetição dos produtos */}
        <tbody>
          {produtos.map((item) => (
            // A propriedade "key" é obrigatória no React quando usamos .map().
            // Ela ajuda o React a saber exatamente qual item é qual através do ID único.
            <tr key={item.id}>
              <td>
                <img 
                  src={item.avatar} 
                  alt={item.nome} 
                  width={60} 
                  height={60} 
                  style={{ objectFit: 'cover', borderRadius: '8px' }} 
                />
              </td>
              <td>{item.id}</td>
              <td><strong>{item.nome}</strong></td>
              {/* toFixed(2) garante que o preço sempre tenha 2 casas decimais (ex: 299.90) */}
              <td>R$ {item.preco.toFixed(2)}</td>
              <td>{item.descricao}</td>
              <td>
                <Link to={`/editar-produto/${item.id}`}><Editar className='w-10 h-10'/></Link>|
                <Excluir style={{cursor:'pointer'}} onClick={()=> abrirModal(item.id)} className='w-10 h-10'/>
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr>
            <td colSpan={6}>Quantidade de produtos: {produtos.length}</td>
          </tr>
        </tfoot>
      </table>
    </main>
  );
}