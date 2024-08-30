import { extendBaseTheme, theme as chakraTheme } from '@chakra-ui/react';

const {
  Button,
  Link,
  Switch,
  Select,
  Textarea,
  Input,
  Heading,
  Tabs,
  Accordion,
} = chakraTheme.components;

export const theme = extendBaseTheme({
  components: {
    Button,
    Link,
    Switch,
    Select,
    Input,
    Textarea,
    Heading,
    Tabs,
    Accordion,
  },
});
