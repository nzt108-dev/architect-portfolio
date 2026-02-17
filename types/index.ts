export interface RoadmapItem {
    title: string;
    status: 'done' | 'in-progress' | 'planned';
}

export interface Project {
    id: string;
    title: string;
    slug: string;
    description: string;
    longDescription: string;
    category: 'mobile' | 'telegram' | 'web' | 'saas' | 'discord';
    progress: number;
    technologies: string[];
    githubUrl: string | null;
    demoUrl: string | null;
    images: string[];
    screenshots: string[];
    ideaText: string;
    clientBenefit: string;
    roadmap: RoadmapItem[];
    createdAt: Date;
}

export interface Skill {
    name: string;
    level: number;
    category: 'language' | 'frontend' | 'backend' | 'database' | 'devops' | 'cloud' | 'architecture';
}

export interface SocialLink {
    name: string;
    url: string;
    icon: string;
}

export interface Category {
    id: string;
    name: string;
    icon: string;
}

export interface Service {
    id: string;
    title: string;
    titleRu: string;
    slug: string;
    icon: string;
    description: string;
    descriptionRu: string;
    features: string[];
    featuresRu: string[];
    timeline: string;
    timelineRu: string;
}
