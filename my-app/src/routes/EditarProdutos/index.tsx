import { useEffect } from "react";
import { useParams } from "react-router";
import type { TipoProduto } from "../../types/types";
import { useForm } from "react-hook-form";

export default function EditarProdutos() {

  const { id } = useParams<{ id: string }>();

  const { register, reset, setValue, formState: { errors } } = useForm<TipoProduto>({
    defaultValues: { id: "", nome: "", preco: 0, estoque: 0, avatar: "" },
    mode: "onChange"
  });

  useEffect(() => {

    const carregaProduto = async () => {
      try {

        const response = await fetch(`http://localhost:3001/produtos/${id}`);

        if (!response.ok) {
          throw new Error(`Falha na requisição do produto... ${response.status} - ${response.statusText}`);
        }

        const data: TipoProduto = await response.json();
        console.log(data);
        reset(data);

      } catch (error) {
        console.error(error);
      }
    }
    carregaProduto();
  }, [])

  return (
    <main>
      <h2>Editar Produtos</h2>
      <form>
        <fieldset>
          <legend>Dados do Produto</legend>
          <div>
            <label htmlFor="nome">Nome do Produto </label>
            <input type="text" id="nome" {...register("nome", { required: "É obrigatório um nome para o produto!", minLength:{value:3,message:"Permitido apenas nomes com no mínimo 3 caracteres!"} })} />
            {errors.nome?.message && <span style={{ color: "#ff0000" }}>{errors.nome?.message}</span>}
          </div>
          <div>
            <label htmlFor="preco">Preço </label>
            <input type="number" step={0.1} id="preco" {...register("preco", { required: "É obrigatório digitar um valor!", min: { value: 1, message: "Permitidos apenas valores maiores que zero!" } })} />
            {errors.preco?.message && <span style={{ color: "#ff0000" }}>{errors.preco?.message}</span>}
          </div>
          <div>
            <label htmlFor="estoque">Estoque </label>
            <input type="number" step={1} id="estoque" {...register("estoque", { required: "É obrigatório digitar um valor!", min: { value: 1, message: "Permitidos apenas valores maiores que zero!" } })} />
            {errors.estoque?.message && <span style={{ color: "#ff0000" }}>{errors.estoque?.message}</span>}
          </div>

        </fieldset>
      </form>
    </main>
  )
}