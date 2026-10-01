import type { TipoProduto } from "../../types/types";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { MdEdit as Editar} from "react-icons/md";
import { RiDeleteBin5Line as Excluir} from "react-icons/ri";

export default function Produtos(){
    document.title = "Produtos";

    //REF para o dialog para o produto que será deletado
    const dialogRef = useRef<HTMLDialogElement>(null);
    //STATE do DIALOG para o produto que será deletado:
    const[idExclusivo,setIdExclusivo] = useState<string>("");

    //criando o redirecionador
    const navigate = useNavigate();

    //estrutura que vai receber a lista, seja ela mocada ou externa
    const[produtos, setProdutos] = useState<TipoProduto[]>([]);

    useEffect( ()=> {
        //função para carregar os dados
        const carregaProdutos = async ()=>{
            try{

                const response = await fetch("http://localhost:3001/produtos");

                if(!response.ok){
                    throw new Error(`Falha na requisição dos produtos... ${response.status} - ${response.statusText}`);
                }

                const data: TipoProduto[] = await response.json();
                console.log(data);
                setProdutos(data);
                

            }catch(error){
                console.error(error);
            }
        }
        carregaProdutos();
    }, []);

    const handleDelete = async(id:string)=>{
        try{

            const response = await fetch(`http://localhost:3001/produtos/${id}`, {
                method: "DELETE",});

                if(!response.ok){
                    throw new Error(`Falha na exclusão... ${response.status} - ${response.statusText}`);
                    
                }
                alert("Produto excluído com sucesso!")
                navigate("/");

        } catch(error){
            console.error(error)
        }
    }
    

    return(
        <main>
            <h2>Produtos</h2>
            <table border={1} style={{margin:"0 auto",borderCollapse:"collapse"}}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Preço</th>
                        <th>AVATAR</th>
                        <th>AÇÕES</th>
                    </tr>
                </thead>
                <tbody>
                    {produtos.map( (p)=> (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.nome}</td>
                            <td>{p.preco}</td>
                            <td><img src={p.avatar} alt={p.nome} width={30}/></td>
                            <td><Link to={`/editar-produtos/${p.id}`}><Editar /></Link> | 
                            <Excluir style={{cursor:"pointer"}} onClick={()=>handleDelete(p.id)}/>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={5}>Quantidade de Produtos: {produtos.length}</td>
                    </tr>
                </tfoot>
            </table>
        </main>
    )
}