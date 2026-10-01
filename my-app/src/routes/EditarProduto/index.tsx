import { useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import type { Produto } from "../../types/produto";
import { useForm } from "react-hook-form";

export default function EditarProduto() {

    const {id} = useParams<{id:string}>();

    const {register, reset, handleSubmit, setValue, formState:{errors}} = useForm<Produto>({
        defaultValues:{id:"", nome:"", preco:0, descricao:"", avatar:""},
        mode: "onChange"
    });

    useEffect(() => {
        const carregaProduto = async () => {
            try{
              const response = await fetch(`http://localhost:3001/produtos/${id}`)
              if (!response.ok){
                throw new Error (`Falha na requisição do produto... ${response.status} - ${response.statusText}`)
              }
              const data:Produto = await response.json();
              console.log(data);
              reset(data);
            } catch (error) {
              console.error(error)
            } 
          }
          carregaProduto();
          }, []);

    const navigate = useNavigate();

    const onSubmit = async (data: Produto) => {
        try {
          const response = await fetch(`http://localhost:3001/produtos/${data.id}`,{
            method: "PUT",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(data)
          })
          if (!response.ok){
            throw new Error (`Falha na atualização do produto... ${response.status} - ${response.statusText}`)
          }
          alert("PRODUTO ATUALIZADO COM SUCESSO!")
          navigate("/produtos")
          const data:Produto[] = await response.json();
          console.log(data)
        } catch (error) {
          console.error(error)
        }
    }

    return (
        <main>
            <section>
                <h2>Editar produtos</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset>
                        <legend>Dados do Produto</legend>
                        <div>
                            <label htmlFor="nome">Nome do Produto</label>
                            <input type="text" id="nome" {...register("nome", {required:"É obrigatório um nome para o produto", minLength: {value:3, message:"Permitido apenas nomes com no mínimo 3 caractéres"}})}/>
                            {errors.nome?.message && <span style={{ color: "#ff0000" }}>{errors.nome?.message}</span>}
                        </div>
                        <div>
                            <label htmlFor="preco">Preço do Produto</label>
                            <input type="number" step={0.1} id="preco" {...register("preco", {required:"É obrigatório um valor para o produto", min: {value:1, message:"Permitido apenas valores maiores que 0"}})}/>
                            {errors.preco?.message && <span style={{ color: "#ff0000" }}>{errors.preco?.message}</span>}
                        </div>
                        <div>
                            <label htmlFor="descricao">Descrição do Produto</label>
                            <input type="text" id="descricao" {...register("descricao", {required:"É obrigatório uma descrição para o produto", minLength: {value:3, message:"Permitido apenas descrições com no mínimo 3 caractéres"}})}/>
                            {errors.descricao?.message && <span style={{ color: "#ff0000" }}>{errors.descricao?.message}</span>}
                        </div>
                        <div>
                            <button type="submit">Atualizar Produto</button>
                        </div>
                    </fieldset>
                </form>
            </section>
        </main>
    )
}