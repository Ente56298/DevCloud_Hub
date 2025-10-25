import { Service, Project, FileItem, AiAssistant, AgentProfile } from './types';
import { GoogleDriveIcon, DropboxIcon, OneDriveIcon, TelegramIcon, ProjectIcon, ArrowsPointingInIcon, BookOpenIcon, ShieldCheckIcon, ArchiveBoxIcon, ChartBarSquareIcon, WrenchScrewdriverIcon, MegaphoneIcon } from './components/icons';

export const SERVICES: Service[] = [
  { id: 'gdrive', name: 'Google Drive', icon: GoogleDriveIcon },
  { id: 'dropbox', name: 'Dropbox', icon: DropboxIcon },
  { id: 'onedrive', name: 'One Drive', icon: OneDriveIcon },
  { id: 'telegram', name: 'Telegram', icon: TelegramIcon },
];

export const PROJECTS: Project[] = [
  { id: 'webapp', name: 'WebApp Redesign', icon: ProjectIcon },
  { id: 'mobile', name: 'Mobile App Launch', icon: ProjectIcon },
  { id: 'api', name: 'API Integration', icon: ProjectIcon },
];

const MOCK_PNG_CONTENT = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAZlBMVEX///8AAACZmZmsrKzNzc2ysrL5+fmpqan7+/uUlJT19fXm5ubDw8N6enrExMTb29uLi4uioqK9vb2EhIRPT09bW1uQkJCfn59paWlISEgvLy+6urqRkZFgYGCampp3d3c2NjZXV1cNDQ24uepMAAAEIUlEQVR4nO2da3uqOBSGMYKCFcxDVUW8tff9v+E5LSAgQZloe+79fT91OJlBJskUvA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4F+QmJjQyGSy+TaZzI2xWeQ3I/mNyL9t3qW/Yv5i/mP+i/m/+Q/z/nl/vP/S/y/P//8/zv+5/zP/9/zP+h/z//G/7D/Pf8j/sP8//xv+x/z3/E/7H/E/4H/M/7D/E/7D/lf8j/sP+Z/wX/Y/5n/Ff9L/kv+5/wX/I/6L/kf8L/ov+Z/y3/S/5b/qf8D/gP+p/wP+B/yX/c/4H/Pf8L/qf8j/gv+5/yP+B/yP+u/5n/Y/4L/kP+p/wH/E/6b/kf8b/pP+d/yv+l/xX/S/6b/nf8D/pv+Z/wX/b/87/hv+n/73/E/6b/rf8T/hv+p/zP+m/63/A/5r/rf8L/iP+9/wv+a/63/Of9D/r/+h/xP+h/2v+B/x/+5/wn/X/8D/kP+1/0X/I/7n/Nf9T/iv+p/xX/U/4r/qf8D/qf9X/kv+J/z/+W/6n/A/6b/qf8b/gv+t/wX/Y/7r/mf8b/iv+5/yX/c/5r/i/+B/1v+N/wv+s/7X/O/4b/of8t/xP+1/wH/C/7b/nf8B/xP+p/xP+R/wX/E/6b/if87/of89/wv+u/6H/M/5n/Y/4r/tf9F/yP+p/xH/M/7n/Rf8z/sP+R/zP+y/7n/B/6z/M/4H/I/4n/U/4n/E/6r/M/4n/A/7r/gP+p/wP+B/3f+E/6H/Nf9b/gP+r/33/c/6H/M/7b/Gf8j/uf89/yP+B/zP+R/wH/E/6D/kP8h/xH+g/47/gf9R/0P+1/zP+A/4H/Lf9D/iv+h/0X/I/7X/Vf87/uf9B/yX/c/4H/Ef97/iP8h/3P+x/wn+l/wv+x/yX/c/5j/gf8D/gf8T/jv+d/yv+c/4H/Nf8D/gv+d/xH/G/5n/I/4L/Nf8z/oP+R/yH/M/57/gv+R/y3/c/4n/Bf87/kv+h/xP+x/2P+Z/wP+R/zH/E/4L/Uf9D/u/+h/zP+h/wP+a/6z/N/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwO18sP/V/2F++P+s/yL/u/7L/F/6f/Bf8z/tP8l/1v+S/63/N/73/Wf9N/yP+N/2P+W/7r/qf8l/xP+Z/y/+w/zX/Wf8b/jv+J/wv+c/6r/rv+u/6z/k/+F/z3/ff8z/of8t/2/+u/4b/o/89/3f+a/7b/ov+W/4n/ef9v/v/+N/3X/f/4j/iv+e/4L/ov+H/3X/e/7X/Nf8v/tf8D/q/+1/yX/b/87/iv+r/zP+d/0v+T/yP+u/6j/ov+i/7r/ov+O/7X/V/5L/vf8V/2v+p/z3/b/4L/uv+B/0/+6/4z/rf+J/yv/Tf+L/sf91/2v/Q/5j/jf9f/kP+V/7L/uP8N/wH/If+B/3/+e/7z/r/+a/6n/Qf+F/3n/i/6D/uf91/xP+s/7T/hf8t/xP+x/xX/T/6T/nf9H/o/+5/3P+i/4P/C/47/t/+Z/0H/af+H/uf9V/x3/R/5n/Kf9v/uP+N/2X/Vf+T/m/+9/wH/bf+z/gv+r/wf+8/7n/Sf95/w3/Tf+B/zX/g/4L/tv+5/yP+W/5r/rv+p/xP++/4b/uv+e/7P/Tf9L/k/+f/3X/Nf9T/jP/27/cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC/wLwX+1kXD94XMAAAAASUVORK5CYII=';

export const MOCK_FILES: FileItem[] = [
  { id: '1', name: 'Design_Sprint_Notes.docx', type: 'file', size: '1.2 MB', modified: '2023-10-26', service: 'gdrive', projectId: 'webapp' },
  { id: '2', name: 'User_Flow.fig', type: 'file', size: '3.4 MB', modified: '2023-10-25', service: 'gdrive', projectId: 'webapp', content: 'Figma file content placeholder' },
  { id: '3', name: 'Marketing_Assets', type: 'folder', size: '25.8 MB', modified: '2023-10-24', service: 'dropbox', projectId: 'mobile' },
  { id: '4', name: 'launch_plan.pdf', type: 'file', size: '800 KB', modified: '2023-10-23', service: 'dropbox', projectId: 'mobile', parentId: '3' },
  { id: '5', name: 'endpoints.json', type: 'file', size: '50 KB', modified: '2023-10-26', service: 'onedrive', projectId: 'api', content: '{"api": "v1", "status": "ok"}' },
  { id: '6', name: 'documentation.md', type: 'file', size: '120 KB', modified: '2023-10-22', service: 'onedrive', projectId: 'api' },
  { id: '10', name: 'README.md', type: 'file', size: '2 KB', modified: '2023-10-27', service: 'gdrive', projectId: 'webapp', content: '# WebApp Redesign\nThis project is about redesigning the main web application.' },
  { id: '11', name: 'logo.png', type: 'file', size: '1 KB', modified: '2023-10-28', service: 'dropbox', projectId: 'webapp', content: MOCK_PNG_CONTENT, parentId: '3' },
  { id: '12', name: 'project_backup.zip', type: 'file', size: '15.3 MB', modified: '2023-10-29', service: 'telegram', projectId: 'api' },
  { id: '13', name: 'Saved Messages', type: 'folder', size: '1.1 GB', modified: '2023-10-28', service: 'telegram' },
  { id: '14', name: 'bot_script.py', type: 'file', size: '12 KB', modified: '2023-10-29', service: 'telegram', projectId: 'api', content: 'import telegram\n\nbot = telegram.Bot(token="YOUR_TOKEN")\nprint(bot.get_me())' },
  { id: '15', name: 'Brand Guidelines', type: 'folder', size: '5.2 MB', modified: '2023-10-20', service: 'dropbox', projectId: 'mobile', parentId: '3' },
  { id: '16', name: 'style_guide.pdf', type: 'file', size: '5.2 MB', modified: '2023-10-20', service: 'dropbox', projectId: 'mobile', parentId: '15' },
];

export const AI_ASSISTANTS: AiAssistant[] = [
  { id: 'gemini', name: 'Gemini' },
];

export const AGENT_PROFILES: AgentProfile[] = [
  {
    id: 'consolidator',
    name: 'Consolidator Agent',
    description: 'Detects and flags duplicate or versioned files across all connected drives to propose consolidation actions.',
    icon: ArrowsPointingInIcon,
    status: 'idle',
  },
  {
    id: 'narrator',
    name: 'Narrator Agent',
    description: 'Generates executive summaries, project narratives, or update reports based on file activity and content.',
    icon: BookOpenIcon,
    status: 'idle',
  },
  {
    id: 'auditor',
    name: 'Auditor Agent',
    description: 'Monitors file structures for compliance with predefined rules (e.g., presence of README, LICENCE files).',
    icon: ShieldCheckIcon,
    status: 'idle',
  },
  {
    id: 'legacy_curator',
    name: 'Legacy Curator Agent',
    description: 'Identifies and tags old or inactive projects, suggesting archival or migration to cold storage.',
    icon: ArchiveBoxIcon,
    status: 'idle',
  },
  {
    id: 'visualizer',
    name: 'Visualizer Agent',
    description: 'Generates data for dashboards (Grafana) or knowledge graphs (Neo4j) to visualize the ecosystem.',
    icon: ChartBarSquareIcon,
    status: 'idle',
  },
  {
    id: 'evangelist',
    name: 'Evangelist Agent',
    description: 'Orchestrates the publication of insights, proclamations, or reports to external platforms like 10Web, Notion, or Telegram.',
    icon: MegaphoneIcon,
    status: 'idle',
  },
  {
    id: 'auto_analyzer',
    name: 'Auto-Analyzer Agent',
    description: 'Periodically runs a self-assessment of the ecosystem and its own performance, suggesting improvements.',
    icon: WrenchScrewdriverIcon,
    status: 'idle',
  },
];