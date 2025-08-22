module.exports = async function() {
  const file = app.workspace.getActiveFile();
  if (file && confirm(`Удалить "${file.name}"?`)) {
    await app.vault.delete(file, true);
  }
}