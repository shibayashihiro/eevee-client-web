import React, { Component, ReactNode, ErrorInfo } from 'react';
import { ListItem, UnorderedList, Text } from '@chakra-ui/react';
import { withRouter, NextRouter } from 'next/router';

import { getDisplayMessage } from '@/utils/errors';

import { ModalDialog } from './ui/ModalDialog';

const isDev = process.env.NODE_ENV === 'development';

type Props = {
  router: NextRouter;
  children: ReactNode;
};

type State = {
  error: Error | null;
  hasError: boolean;
};

class ErrorBoundary extends Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { error: null, hasError: false };
  }
  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI
    return { error, hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can use your own error logging service here
    console.error({ error, errorInfo });
  }

  render() {
    const { error, hasError } = this.state;
    const { message, details } = getDisplayMessage(error, isDev);

    if (hasError) {
      return (
        <ModalDialog
          title="エラー"
          isOpen={true}
          onClose={() => {
            return;
          }}
          closeOnOverlayClick={false}
        >
          <Text>{message}</Text>
          {isDev && details && (
            <UnorderedList>
              {details.map((detail, index) => (
                <ListItem key={index}>{detail}</ListItem>
              ))}
            </UnorderedList>
          )}
          <Text>恐れ入りますがページを開き直し、ホーム画面から改めて操作してください。</Text>
        </ModalDialog>
      );
    }

    return this.props.children;
  }
}

export default withRouter(ErrorBoundary);
