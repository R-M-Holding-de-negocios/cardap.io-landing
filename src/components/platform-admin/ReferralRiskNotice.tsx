export default function ReferralRiskNotice({flags}:{flags:string[]}){
 if(!flags.length)return null;
 return <p role="alert" className="mt-1 text-sm font-bold text-red-700">{flags.includes('same_phone')&&'Telefone do proprietário coincide com o do afiliado. '}{flags.includes('same_email')&&'E-mail do proprietário coincide com o do afiliado. '}Confira a propriedade antes de aprovar a indicação.</p>;
}
