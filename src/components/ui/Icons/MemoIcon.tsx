import { Icon } from '@chakra-ui/react';
import { ComponentProps } from 'react';

export const MemoIcon = (props: ComponentProps<typeof Icon>) => {
  return (
    <Icon {...props} viewBox="0 0 18 16">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.70093 4C3.70093 2.89543 4.59636 2 5.70093 2H13.1197C14.2243 2 15.1197 2.89543 15.1197 4V12C15.1197 13.1046 14.2243 14 13.1197 14H5.70093C4.59636 14 3.70093 13.1046 3.70093 12V4ZM5.12828 3.33333H13.6924V12.6667H5.12828V3.33333ZM12.265 6.66667H6.55563V5.33333H12.265V6.66667ZM6.55563 7.33333V8.66667H12.265V7.33333H10.124H6.55563ZM12.265 10.6667H6.55563V9.33333H12.265V10.6667Z"
        fill="currentColor"
      />
    </Icon>
  );
};
