import { Icon } from '@chakra-ui/react';
import { ComponentProps } from 'react';

export const YenIcon = (props: ComponentProps<typeof Icon>) => {
  return (
    <Icon {...props} viewBox="0 0 24 24">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12Zm2 0c0 4.41 3.59 8 8 8s8-3.59 8-8-3.59-8-8-8-8 3.59-8 8Z"
        clipRule="evenodd"
      />
      <path
        fill="currentColor"
        d="m16 7-2.047 4.583h1.921v1.338H13.26l-.33.709v.567h2.944v1.338h-2.945v2.268h-1.968v-2.268H8v-1.338h2.96v-.567l-.33-.709H8v-1.338h2.252L8.189 7h2.047l1.843 4.724L14 7h2Z"
      />
    </Icon>
  );
};
