import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Box, Heading, Radio, Stack, Text, HStack, Circle, Textarea, Divider, Tag, RadioGroup } from '@chakra-ui/react';

import variables from '@/styles/variables.module.scss';
import { AnswerType, CompletedSurveyInput } from '@/graphql/generated/types';
import { NextPageWithLayout } from '@/types';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button';
import { useFacilityId, useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { Navbar } from '@/components/domain/Navbar';
import { generateMutationId, isSurvey, isSurveyConfig, isSurveyForm } from '@/graphql/helper';
import { surveyEndPage } from '@/utils/paths/facilityPages';
import { CheckboxIcon } from '@/components/ui/Icons/CheckboxIcon';

import { useSendCompletedSurveyMutation } from './Survey.mutation.generated';
import { useSurveyPageQuery } from './Survey.query.generated';

type Question = {
  id: string;
  order: number;
  question: string;
  required: boolean;
  answerType: AnswerType;
  answers: Array<string>;
};

export const SurveyPage: NextPageWithLayout = () => {
  const router = useTenantRouter();
  const { surveyId } = router.query;
  if (typeof surveyId !== 'string') {
    throw new Error('SurveyPage: invalid query');
  }

  const facilityId = useFacilityId();
  const [completedSurveys, setCompletedSurveys] = useState<CompletedSurveyInput[]>([]);
  const [_, sendSurvey] = useSendCompletedSurveyMutation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const [result] = useSurveyPageQuery({ variables: { surveyId: surveyId } });
  const { data, fetching, error } = result;
  useLoadingOverlay(fetching);
  if (error) {
    handleErrorWithAlertDialog(error);
  }
  const questionRows =
    data &&
    data.survey &&
    isSurvey(data.survey) &&
    data.survey.surveyConfig &&
    isSurveyConfig(data.survey.surveyConfig) &&
    data.survey.surveyConfig.surveyForm &&
    isSurveyForm(data.survey.surveyConfig.surveyForm)
      ? data.survey.surveyConfig.surveyForm.rows
      : [];

  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (questionRefs.current[currentQuestion]) {
      questionRefs.current[currentQuestion].scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentQuestion]);

  const handleNext = () => {
    // 任意の場合は空の配列を入れる
    if (completedSurveys[currentQuestion]?.answers == null) {
      completedSurveys[currentQuestion] = {
        question: questionRows[currentQuestion].question,
        answers: [],
      };
    }

    if (currentQuestion < questionRows.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    const { error } = await sendSurvey({
      input: {
        clientMutationId: generateMutationId(),
        surveyID: surveyId,
        completedSurvey: completedSurveys,
      },
    });
    if (error) {
      handleErrorWithAlertDialog(error);
      return;
    }
    // アンケートの送信処理をここに記述
    router.push(surveyEndPage(facilityId, surveyId));
  };

  const handleCheckboxClick = (target: string) => {
    const updatedAnswers = [...completedSurveys];
    if (!updatedAnswers[currentQuestion]) {
      updatedAnswers[currentQuestion] = {
        question: questionRows[currentQuestion].question,
        answers: [],
      };
    }
    // すでに選択されている場合は削除し、選択されていない場合は追加
    if (updatedAnswers[currentQuestion].answers.includes(target)) {
      updatedAnswers[currentQuestion].answers = updatedAnswers[currentQuestion].answers.filter(
        (answer) => answer !== target,
      );
    } else {
      updatedAnswers[currentQuestion].answers.push(target);
    }
    setCompletedSurveys(updatedAnswers);
  };

  const handleRadioClick = (target: string) => {
    const updatedAnswers = completedSurveys.map((answer, index) =>
      index === currentQuestion
        ? { question: questionRows[currentQuestion].question, answers: [target.toString()] }
        : answer,
    );
    if (!updatedAnswers[currentQuestion]) {
      updatedAnswers[currentQuestion] = {
        question: questionRows[currentQuestion].question,
        answers: [target],
      };
    }

    setCompletedSurveys(updatedAnswers);
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    const updatedAnswers = [...completedSurveys];
    updatedAnswers[currentQuestion] = {
      question: questionRows[currentQuestion].question,
      answers: [value],
    };
    setCompletedSurveys(updatedAnswers);
  };

  // TODO: コンポーネントに分ける
  const renderQuestion = (question: Question) => {
    switch (question.answerType) {
      case AnswerType.Checkbox:
        return (
          <Stack direction="column">
            {question.answers.map((answer: string, index: number) => (
              <Box
                pt="18px"
                pb="18px"
                pl="12px"
                pr="12px"
                className="bold-small"
                borderRadius="4px"
                borderWidth={completedSurveys[currentQuestion]?.answers.includes(answer) ? '2px' : '1px'}
                mb="12px"
                color={completedSurveys[currentQuestion]?.answers.includes(answer) ? 'brand.primary' : 'mono.secondary'}
                borderColor={
                  completedSurveys[currentQuestion]?.answers.includes(answer) ? 'brand.primary' : 'mono.secondary'
                }
                key={index}
                cursor="pointer"
                onClick={() => handleCheckboxClick(answer)}
              >
                <HStack>
                  <CheckboxIcon
                    checked={completedSurveys[currentQuestion]?.answers.includes(answer)}
                    disabled={false}
                  />
                  <Text>{answer}</Text>
                </HStack>
              </Box>
            ))}
          </Stack>
        );
      case AnswerType.NumberRadio:
        return (
          <Stack direction="row" spacing="8px" justify="center" wrap="wrap">
            {question.answers.map((answer: string, index: number) => (
              <Circle
                className="bold-small"
                color={completedSurveys[currentQuestion]?.answers.includes(answer) ? 'mono.white' : 'brand.primaryText'}
                backgroundColor={
                  completedSurveys[currentQuestion]?.answers.includes(answer) ? 'brand.primary' : 'mono.white'
                }
                key={index}
                size="40px"
                borderWidth="1px"
                borderColor="brand.primary"
                cursor="pointer"
                onClick={() => handleRadioClick(answer)}
              >
                {index}
              </Circle>
            ))}
          </Stack>
        );
      case AnswerType.TextRadio:
        return (
          <Stack direction="column">
            <RadioGroup value={completedSurveys[currentQuestion]?.answers[0]}>
              {question.answers.map((answer: string, index: number) => (
                <Box
                  pt="18px"
                  pb="18px"
                  pl="12px"
                  pr="12px"
                  className="bold-small"
                  borderRadius="4px"
                  borderWidth={completedSurveys[currentQuestion]?.answers.includes(answer) ? '2px' : '1px'}
                  mb={index != question.answers.length - 1 ? '12px' : '0'}
                  color={
                    completedSurveys[currentQuestion]?.answers.includes(answer) ? 'brand.primary' : 'mono.secondary'
                  }
                  borderColor={
                    completedSurveys[currentQuestion]?.answers.includes(answer) ? 'brand.primary' : 'mono.secondary'
                  }
                  key={index}
                  cursor="pointer"
                  onClick={() => handleRadioClick(answer)}
                >
                  <HStack>
                    <CheckboxIcon
                      checked={completedSurveys[currentQuestion]?.answers.includes(answer)}
                      disabled={false}
                    />
                    <Text>{answer}</Text>
                  </HStack>
                </Box>
              ))}
            </RadioGroup>
          </Stack>
        );
      case AnswerType.Text:
        return (
          <Stack direction="column">
            <Textarea
              placeholder="ご意見・コメントを入力してください"
              value={completedSurveys[currentQuestion]?.answers[0] || ''}
              onChange={(e) => handleInputChange(e)}
            />
          </Stack>
        );
    }
    return (
      <Stack direction="column">
        {question.answers.map((option: string, index: number) => (
          <Radio key={index} value={option}>
            {option}
          </Radio>
        ))}
      </Stack>
    );
  };

  return (
    data && (
      <Box p={4}>
        <Navbar viewing={data.viewing} viewer={data.viewer} facility={null} />
        <Heading
          as="h2"
          className="mono-primary bold-large"
          color="brand.primaryText"
          backgroundColor="brand.backgroundSoft"
          fontSize="24px"
          pt="24px"
          pb="24px"
          pl="20px"
          pr="20px"
          mb="24px"
          textAlign="center"
        >
          お客様アンケート
        </Heading>
        <Box pl="20px" pr="20px">
          {questionRows.map((row, index) =>
            index !== currentQuestion ? (
              <Box key={index} opacity="0.3" mb="12px">
                <Stack>
                  <HStack minHeight="32px">
                    <Circle
                      size="32px"
                      borderWidth="1px"
                      color="brand.primary"
                      className="text-small"
                      borderColor="brand.primary"
                    >
                      {index + 1}
                    </Circle>
                    <Text className="text-medium">{row.question}</Text>
                  </HStack>
                  {index !== questionRows.length - 1 && (
                    <Box width="32px" height="12px">
                      <Divider ml="15px" borderColor="brand.primary" orientation="vertical" />
                    </Box>
                  )}
                </Stack>
              </Box>
            ) : (
              <HStack
                mb="12px"
                key={index}
                alignItems="flex-start"
                ref={(el) => {
                  questionRefs.current[index] = el;
                }}
              >
                <Stack alignItems="center">
                  <Circle
                    size="32px"
                    borderWidth="1px"
                    className="bold-text-small"
                    color={'mono.white'}
                    backgroundColor={'brand.primary'}
                  >
                    {index + 1}
                  </Circle>
                  <Box mb="8px">
                    <Divider borderColor="brand.primary" orientation="vertical" />
                  </Box>
                </Stack>
                <Stack flex="1">
                  <Text className="bold-medium">{row.question}</Text>
                  <HStack>
                    {questionRows[currentQuestion].required ? (
                      <Tag
                        className="text-micro"
                        color={variables.monoWhite}
                        backgroundColor={variables.monoError}
                        fontWeight="bold"
                        mb={4}
                      >
                        {'必須'}
                      </Tag>
                    ) : (
                      <Tag
                        className="text-micro"
                        color={variables.monoWhite}
                        backgroundColor={variables.monoHint}
                        fontWeight="bold"
                        mb={4}
                      >
                        {'任意'}
                      </Tag>
                    )}
                    {questionRows[currentQuestion].answerType === AnswerType.Checkbox ? (
                      <Text className="mono-secondary  bold-small" mb={4}>
                        {'複数お選びください'}
                      </Text>
                    ) : questionRows[currentQuestion].answerType === AnswerType.NumberRadio ||
                      questionRows[currentQuestion].answerType === AnswerType.TextRadio ? (
                      <Text className="mono-secondary  bold-small" mb={4}>
                        {'１つお選びください'}
                      </Text>
                    ) : (
                      <></>
                    )}
                  </HStack>
                  {renderQuestion(row)}
                  <HStack mt="24px" mb="12px" spacing={4}>
                    <SecondaryButton onClick={handleBack} isDisabled={currentQuestion === 0}>
                      戻る
                    </SecondaryButton>
                    <PrimaryButton
                      onClick={currentQuestion === questionRows.length - 1 ? handleSubmit : handleNext}
                      isDisabled={
                        row.required &&
                        (completedSurveys[currentQuestion]?.answers == null ||
                          completedSurveys[currentQuestion]?.answers.length == 0)
                      }
                    >
                      {currentQuestion === questionRows.length - 1 ? 'アンケートを送信' : '次へ'}
                    </PrimaryButton>
                  </HStack>
                </Stack>
              </HStack>
            ),
          )}
        </Box>
      </Box>
    )
  );
};

export default SurveyPage;
