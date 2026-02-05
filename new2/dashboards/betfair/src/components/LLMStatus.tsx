import Image from 'next/image';

interface LLMConfig {
  name: string;
  logo: string;
  status: 'on' | 'soon';
}

const llms: LLMConfig[] = [
  { name: 'ChatGPT', logo: '/logos/openai.png', status: 'on' },
  { name: 'Claude', logo: '/logos/claude-color.png', status: 'soon' },
  { name: 'Perplexity', logo: '/logos/perplexity-color.png', status: 'soon' },
  { name: 'Gemini', logo: '/logos/gemini-color.png', status: 'soon' },
];

export default function LLMStatus() {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <h3 className="mb-3 text-sm font-medium text-text">Monitored Sources</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {llms.map((llm) => (
          <div
            key={llm.name}
            className={`flex flex-col items-center gap-2 rounded-md border p-3 ${
              llm.status === 'on'
                ? 'border-opportunity/30 bg-opportunity-bg/30'
                : 'border-border bg-surface'
            }`}
          >
            <Image
              src={llm.logo}
              alt={llm.name}
              width={32}
              height={32}
              className={`h-8 w-8 object-contain ${llm.status === 'soon' ? 'opacity-50 grayscale' : ''}`}
            />
            <div className="text-center">
              <div className="text-xs font-medium text-text">{llm.name}</div>
              <div
                className={`text-[10px] font-medium ${
                  llm.status === 'on' ? 'text-opportunity' : 'text-text-muted'
                }`}
              >
                {llm.status === 'on' ? '● ON' : '○ SOON'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
