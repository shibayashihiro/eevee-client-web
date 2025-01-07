import { extendTheme } from '@chakra-ui/react';

import { inputTheme } from './components/input';
import { colors } from './foundations/colors';
import { typography } from './foundations/typography';
import { breakpoints } from './foundations/breakpoints';
import { styles } from './styles';
import { textStyles } from './foundations/text-styles';
import { selectTheme } from './components/select';
import { textareaTheme } from './components/textarea';
import { containerTheme } from './components/container';
import { buttonTheme } from './components/button';

const overrides = {
  styles,
  colors,
  breakpoints,
  ...typography,
  textStyles,
  components: {
    Button: buttonTheme,
    Input: inputTheme,
    Select: selectTheme,
    Textarea: textareaTheme,
    Container: containerTheme,
  },
};

export const theme = extendTheme(overrides);
