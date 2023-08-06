import inquirer from 'inquirer';
import fundService from './services/fund';

type LoafService = 'fund';

export async function main() {
  const serviceHandlers: Record<LoafService, () => void> = {
    fund: fundService
  };

  const choices = await inquirer.prompt([
    {
      name: 'loafService',
      type: 'list',
      message: '请问需要哪种摸鱼服务？',
      choices: [{ name: '我要看基金', value: 'fund' }]
    }
  ]);
  const loafService = choices.loafService as LoafService;
  const handler = serviceHandlers[loafService];
  handler?.();
}
