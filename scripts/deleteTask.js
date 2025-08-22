module.exports = async (params) => {
  const { quickAddApi, app } = params;
  const file = this.app.workspace.getActiveFile();

  if (!file) return;
  
  const confirmed = await quickAddApi.yesNoPrompt(
      "Delete Note?",
      "This action cannot be undone."
  );
  
  app.workspace.activeLeaf.detach();
  if (confirmed) await app.vault.trash(file, true);
} 