import re

file_path = 'src/pages/CollecteOrdreCreatePage.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace <Select fullWidth with <Select disabled={isViewMode} fullWidth
content = content.replace('<Select\n                    fullWidth', '<Select\n                    disabled={isViewMode}\n                    fullWidth')
content = content.replace('<Select\n                  fullWidth', '<Select\n                  disabled={isViewMode}\n                  fullWidth')

# But wait, trancheId has disabled={!selectedIpoId || loadingTranches}
# Let's fix that one specifically:
content = content.replace('disabled={!selectedIpoId || loadingTranches}', 'disabled={isViewMode || !selectedIpoId || loadingTranches}')

# 2. Replace <TextField fullWidth with <TextField disabled={isViewMode} fullWidth
content = content.replace('<TextField\n                  fullWidth', '<TextField\n                  disabled={isViewMode}\n                  fullWidth')
content = content.replace('<TextField\n                    fullWidth', '<TextField\n                    disabled={isViewMode}\n                    fullWidth')

# 3. Replace <ToggleChoice with <ToggleChoice disabled={isViewMode}
content = content.replace('<ToggleChoice\n                    text=', '<ToggleChoice\n                    disabled={isViewMode}\n                    text=')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated successfully")
