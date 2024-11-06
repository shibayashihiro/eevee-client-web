import { FC, ComponentProps } from 'react';
import { Button } from '@chakra-ui/react';

type Props = ComponentProps<typeof Button>;

const BaseButton: FC<Props> = (props: Props) => {
  const { onClick, children } = props;
  const defaultProps = {
    rounded: '28px',
    px: '24px',
    py: '18px',
    w: 'full',
    h: '44px',
  };
  const buttonProps = { ...defaultProps, ...props };
  return (
    <Button {...buttonProps} onClick={onClick} className="bold-small">
      {children}
    </Button>
  );
};

export const PrimaryButton: FC<Props> = (props: Props) => {
  return (
    <BaseButton
      colorScheme="brand"
      color="mono.white"
      {...props}
      _disabled={{
        bg: 'mono.hint',
        color: 'mono.white',
        cursor: 'not-allowed',
        _hover: {
          bg: 'mono.hint',
        },
        _active: {
          bg: 'mono.hint',
        },
      }}
    />
  );
};

export const PrimaryTextColorButton: FC<Props> = (props: Props) => {
  return (
    <BaseButton
      color="brand.primaryText"
      bg="mono.white"
      border="1px"
      borderColor="brand.primaryText"
      _hover={{
        bg: 'mono.white',
      }}
      _active={{
        // TODO: クリックした時のテキスト色をデザイナーに確認する
        color: 'brand.background',
      }}
      {...props}
    />
  );
};

export const SecondaryButton: FC<Props> = (props: Props) => {
  return <BaseButton color="mono.primary" bg="mono.bg" {...props} />;
};
