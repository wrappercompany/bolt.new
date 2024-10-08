import type { WebContainer } from '@webcontainer/api';
import { workbenchStore } from '~/lib/stores/workbench';

export interface AIAction {
  type: 'createFile' | 'runCommand' | 'modifyFile';
  payload: any;
}

export function parseAIResponse(response: string): AIAction[] {
  // Implement parsing logic to extract actions from AI response
  // This is a simplified example; you'd need more robust parsing
  const actions: AIAction[] = [];
  const lines = response.split('\n');
  for (const line of lines) {
    if (line.startsWith('CREATE_FILE:')) {
      const [, path, content] = line.split(':');
      actions.push({ type: 'createFile', payload: { path, content } });
    } else if (line.startsWith('RUN_COMMAND:')) {
      const [, command] = line.split(':');
      actions.push({ type: 'runCommand', payload: { command } });
    }
    // Add more action types as needed
  }
  return actions;
}

export async function executeAction(action: AIAction, webcontainer: WebContainer) {
  switch (action.type) {
    case 'createFile':
      await webcontainer.fs.writeFile(action.payload.path, action.payload.content);
      workbenchStore.addFile(action.payload.path);
      break;
    case 'runCommand':
      const process = await webcontainer.spawn('sh', ['-c', action.payload.command]);
      process.output.pipeTo(new WritableStream({
        write(data) {
          console.log(data);
          // Update UI with command output
          workbenchStore.updateTerminalOutput(data);
        }
      }));
      break;
    // Handle other action types
  }
}