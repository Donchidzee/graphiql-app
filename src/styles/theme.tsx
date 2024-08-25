import {
  extendBaseTheme,
  theme as chakraTheme,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  VStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Box,
  Flex,
  Spacer,
} from '@chakra-ui/react';

const { Button, Link, Switch, Select, Textarea, Input, Heading, Tabs } =
  chakraTheme.components;

export const theme = extendBaseTheme({
  components: {
    Button,
    Link,
    Switch,
    Select,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
    Textarea,
    VStack,
    Heading,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Box,
    Flex,
    Spacer,
  },
});
