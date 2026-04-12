import json
import uuid

input_path = '/home/elvin/projects/cv-saas/automation/n8n/dashchat-bot.json'
output_path = '/tmp/dashchat-fixed.json'

with open(input_path) as f:
    wf = json.load(f)

# n8n v1 requires numeric or string ID on workflow
wf['id'] = 'dashchat-001'

# Ensure all nodes have unique IDs (already set but ensure format)
for node in wf.get('nodes', []):
    if 'id' not in node or not node['id']:
        node['id'] = str(uuid.uuid4())

with open(output_path, 'w') as f:
    json.dump(wf, f, indent=2, ensure_ascii=False)

print(f'Fixed JSON saved to {output_path}')
print(f'Workflow: {wf["name"]} | ID: {wf["id"]}')
print(f'Nodes: {len(wf["nodes"])}')
