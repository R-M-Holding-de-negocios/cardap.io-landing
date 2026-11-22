import { expect, test } from '@playwright/test';

test('restaurant registers on the landing with selected plan and affiliate code',async({page})=>{
 let submitted:Record<string,string>|null=null;
 await page.route('**/api/auth/register',async route=>{
  submitted=route.request().postDataJSON() as Record<string,string>;
  await route.fulfill({status:201,contentType:'application/json',body:JSON.stringify({success:true})});
 });
 await page.goto('/cadastro?plan=pro&ref=ABCDEF123456');
 await expect(page.getByRole('heading',{name:'Crie sua conta'})).toBeVisible();
 await expect(page.getByRole('radio',{name:/Pro/})).toBeChecked();
 await expect(page.getByLabel('Código de afiliado')).toHaveValue('ABCDEF123456');
 await page.getByLabel('Estabelecimento').fill('Restaurante Teste');
 await page.getByLabel('Seu nome').fill('Pessoa Teste');
 await page.getByLabel('E-mail').fill('teste@example.com');
 await page.getByLabel('WhatsApp').fill('11999999999');
 await page.getByLabel('Senha de acesso').fill('senha-de-teste-123');
 await page.getByRole('button',{name:'Criar conta e continuar'}).click();
 await expect(page.getByText('Conta criada')).toBeVisible();
 await expect(page.getByRole('link',{name:'Entrar para acompanhar o pagamento'})).toHaveAttribute('href','https://app.example.test/login');
 expect(submitted).toMatchObject({planId:'pro',paymentMethod:'PIX',ref:'ABCDEF123456',email:'teste@example.com'});
});

test('registration error stays on the landing with the form available',async({page})=>{
 await page.route('**/api/auth/register',route=>route.fulfill({status:409,contentType:'application/json',body:JSON.stringify({error:'E-mail já cadastrado'})}));
 await page.goto('/cadastro');
 await page.getByLabel('Estabelecimento').fill('Restaurante Teste');
 await page.getByLabel('Seu nome').fill('Pessoa Teste');
 await page.getByLabel('E-mail').fill('teste@example.com');
 await page.getByLabel('WhatsApp').fill('11999999999');
 await page.getByLabel('Senha de acesso').fill('senha-de-teste-123');
 await page.getByRole('button',{name:'Criar conta e continuar'}).click();
 await expect(page.getByRole('alert').filter({hasText:'E-mail já cadastrado'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Criar conta e continuar'})).toBeEnabled();
});
