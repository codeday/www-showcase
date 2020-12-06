import React from 'react';
import Box from '@codeday/topo/Atom/Box';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import Content from '@codeday/topo/Molecule/Content';
import Page from '../../../components/Page';
import { mintJudgingToken } from '../../../util/token';
import { tryAuthenticatedApiQuery } from '../../../util/api';
import { PROJECT_TYPES } from '../../../util/projectTypes';
import { JudgingPoolResultsQuery } from './results.gql';

export default function JudgingResults({ error, results, criteria, poolToken, name }) {
  if (error) return <Page><Content><Text>Error fetching results.</Text></Content></Page>;

  const sortedCriteria = criteria.sort((a, b) => b.weight - a.weight);
  const getSubscoreForCriteria = (subScores, id) => subScores.filter((s) => s.judgingCriteria.id === id)[0] || null;

  return (
    <Page title="Ratings" slug={`/judge/${poolToken}/results`}>
      <Content mt={-8}>
        <Box textAlign="center">
          <Heading as="h2" fontSize="4xl">Judges&apos; Summarized Scores</Heading>
          <Heading as="h3" fontSize="3xl" mb={8} color="current.textLight">{name}</Heading>
        </Box>
        <Box as="table" margin="0 auto">
          <Box as="tr" borderBottomWidth={2}>
            <Box as="td"></Box>
            <Box as="td"></Box>
            <Box as="td" p={4} textAlign="center" fontWeight="bold">Vote Count</Box>
            <Box as="td" p={4} textAlign="center" fontWeight="bold">Overall</Box>
            {sortedCriteria.map((c) => (
              <Box as="td" p={4} textAlign="center" fontWeight="bold" borderLeftWidth={2}>
                <Box>{c.name}</Box>
                <Box color="current.textLight">({Math.round((c.weight || 0) * 100)}%)</Box>
              </Box>
            ))}
          </Box>
          {results.map((r, i) => (
            <Box as="tr" bg={i%2 === 1 && 'current.border'}>
              <Box as="td" style={{ whiteSpace: 'nowrap' }} pl={2} pr={4} pt={1} pb={1} fontWeight="bold">
                {r.project.name}
              </Box>
              <Box as="td">{PROJECT_TYPES[r.project.type] || r.project.type}</Box>
              <Box as="td">{r.count}</Box>
              <Box as="td" textAlign="center">{Math.floor(r.value * 100)}%</Box>
              {sortedCriteria.map((c) => (
                <Box as="td" textAlign="center" borderLeftWidth={2}>
                  {Math.round((getSubscoreForCriteria(r.subScores, c.id)?.value || 0) * 100)}%
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Content>
    </Page>
  );
}

export async function getServerSideProps({ req, res, params: { pool } }) {
  const backendToken = mintJudgingToken(pool, null);
  const { result, error } = await tryAuthenticatedApiQuery(JudgingPoolResultsQuery, {}, backendToken);

  if (error) {
    res.statusCode = 404;
    console.error(error);
    return {
      props: {
        error: error.message,
      },
    };
  }

  return {
    props: {
      name: result?.showcase?.myJudgingPool?.name,
      results: result?.showcase?.myJudgingPool?.results,
      criteria: result?.showcase?.myJudgingPool?.judgingCriteria,
      poolToken: pool,
    },
  };
}
