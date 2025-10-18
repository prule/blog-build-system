// Define a type for your configuration for type safety
interface SiteConfiguration {
    title: string;
    socials: Array<Social>;
}

interface Social {
    icon: string;
    url: string;
}
