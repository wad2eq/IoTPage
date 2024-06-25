export type Feature = {
  button: button;
  image: string;
  contents: Content[];
  title: string;
};

export type Content = {
  header: string;
  text: string
}

export type Button = {
  enable: boolean;
  label: string;
  link: string;
};
