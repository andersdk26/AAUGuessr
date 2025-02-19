interface PageProps {
    name: string;
    path: string;
    dynamicPath?: string;
    //component: () => ReactNode;
    disabled: boolean;
}

// List of pages to be displayed in the navbar
const pageList: PageProps[] = [
    { name: "Home", path: "/", disabled: false },
    {
        name: "HTTP Test",
        path: "/http_test/",
        dynamicPath: ":id",
        disabled: false,
    },
    {
        name: "Bootstrap",
        path: "/bootstrap/",
        dynamicPath: ":tab",
        disabled: false,
    },
];

export default pageList;
