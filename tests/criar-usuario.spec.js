
import { test, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

// URL da página de cadastro
const URL_CADASTRO =
  'https://sergiocotiazure20265-ops.github.io/produtos-cypress-site/cadastro.html';

// Cenário de teste
test('Deve criar um novo usuário válido com sucesso', async ({ page }) => {

  // acessar a página de cadastro do sistema
  await page.goto(URL_CADASTRO);

  // gerar um e-mail exclusivo para evitar conflitos entre execuções
  const email = `usuario${Date.now()}@teste.com`;

  // preencher o nome do usuário
  await page.locator('#nomeUsuario').fill('Usuário de Teste');

  // preencher o e-mail do usuário
  await page.locator('#emailUsuario').fill(email);

  // preencher a senha do usuário
  await page.locator('#senhaUsuario').fill('Teste@123');

  // clicar no botão de cadastro
  await page.locator('#btnCadastrarUsuario').click();

  // verificar se o cadastro foi realizado com sucesso
  await expect(
    page.locator('#alertaCadastroUsuario')
  ).toHaveText(
    'Usuário cadastrado com sucesso. Você já pode fazer login.'
  );

  // criar a pasta de evidências, caso não exista
  await mkdir('evidencias', { recursive: true });

  // gerar evidência do cadastro realizado com sucesso
  const evidencia = await page.screenshot({
    path: 'evidencias/cadastro-usuario-sucesso.png',
    fullPage: true
  });

  // anexar a evidência ao relatório de teste
  await test.info().attach('Evidência do cadastro de usuário com sucesso', {
    body: evidencia,
    contentType: 'image/png'
  });

});

// Cenário de teste
test('Não deve permitir o cadastro de usuários com o mesmo email', async ({ page }) => {

  // acessar a página de cadastro do sistema
  await page.goto(URL_CADASTRO);

  // utilizar um e-mail exclusivo para este cenário
  const email = `duplicado${Date.now()}@teste.com`;

  // preencher os dados do primeiro usuário
  await page.locator('#nomeUsuario').fill('Primeiro Usuário');
  await page.locator('#emailUsuario').fill(email);
  await page.locator('#senhaUsuario').fill('Teste@123');

  // cadastrar o primeiro usuário
  await page.locator('#btnCadastrarUsuario').click();

  // verificar se o primeiro cadastro foi realizado com sucesso
  await expect(
    page.locator('#alertaCadastroUsuario')
  ).toHaveText(
    'Usuário cadastrado com sucesso. Você já pode fazer login.'
  );

  // preencher os dados de um segundo usuário com o mesmo e-mail
  await page.locator('#nomeUsuario').fill('Segundo Usuário');
  await page.locator('#emailUsuario').fill(email);
  await page.locator('#senhaUsuario').fill('OutraSenha@123');

  // tentar cadastrar o usuário com e-mail duplicado
  await page.locator('#btnCadastrarUsuario').click();

  // verificar se o sistema bloqueou o cadastro duplicado
  await expect(
    page.locator('#alertaCadastroUsuario')
  ).toHaveText(
    'Já existe um usuário cadastrado com este e-mail.'
  );

  // garantir que a mensagem de erro esteja visível
  await expect(
    page.locator('#alertaCadastroUsuario')
  ).toBeVisible();

  // criar a pasta de evidências, caso não exista
  await mkdir('evidencias', { recursive: true });

  // gerar evidência da tentativa de cadastro duplicado
  const evidencia = await page.screenshot({
    path: 'evidencias/cadastro-email-duplicado.png',
    fullPage: true
  });

  // anexar a evidência ao relatório de teste
  await test.info().attach('Evidência do bloqueio de e-mail duplicado', {
    body: evidencia,
    contentType: 'image/png'
  });

});
