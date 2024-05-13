import React, { useEffect, useState } from 'react';
import { getSession } from 'next-auth/client';
import { Heading, Box, Link, Text, Grid} from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { tryAuthenticatedApiQuery } from '../../../util/api';
import { GetAllProjectsAndStudentsQuery } from './fun.gql';
import { mintToken } from '../../../util/token';
import ForceLoginPage from '../../../components/ForceLoginPage';
import Page from '../../../components/Page';
import { Progress } from '@chakra-ui/react'
import { DateTime } from 'luxon';
import { Router, useRouter } from 'next/router';
import { keyframes, css } from '@emotion/react';


export default function Results({ projects, loggedIn }) {
  const [allStudents, setAllStudents] = useState({})
  const [pjCount, setPjCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const students = Object.fromEntries(projects.flatMap((p) => p.members.map((m) => ([m.username, { name: m.account.name, voted:false}]))))
    let count = 0
    projects.forEach((project) => {
      project.peerJudgements.forEach((pj) => {   
        count += 1  
        if(Object.keys(students).includes(pj.username)) {
        students[pj.username].voted = pj.createdAt
        }
      })
    })
    console.log(students)
    setAllStudents(students)
    setPjCount(count)
  }, [projects])

  useEffect(() => {
    const intervalId = setInterval(() => {
      router.push(router.asPath) // refreshes server side props
    }, 5000)
  
    return () => clearInterval(intervalId);
   
  }, [])
  if (!loggedIn) return <ForceLoginPage />;

  const rainbow = keyframes`
  to {background-position:0 -1000%}
`

  const progressAnimation = `
  #progress-bar > div {

    min-height:100%;
    background-image:
     linear-gradient(rgba(255,0,0,1) 0%, rgba(255,154,0,1) 10%, rgba(208,222,33,1) 20%, rgba(79,220,74,1) 30%, rgba(63,218,216,1) 40%, rgba(47,201,226,1) 50%, rgba(28,127,238,1) 60%, rgba(95,21,242,1) 70%, rgba(186,12,248,1) 80%, rgba(251,7,217,1) 90%, rgba(255,0,0,1) 100%) 
     0 0/100% 10000%;
    //  animation: ${rainbow} 2s linear infinite;
  }     
`
  
  return (
    <Page>
      <Content >
      <Heading>TO VOTE: <Text fontSize='5xl' d='inline' color='brand' >showcase.codeday.org/vote</Text></Heading>
      <Heading>Voting Results</Heading>
      <Heading><Text d='inline' color='brand'>{pjCount}</Text> votes cast</Heading>
      <style>{progressAnimation}</style>
      <Progress id='progress-bar' bgWidth={0} isAnimated css={[progressAnimation]}
      m={10} h={10} colorScheme='green' hasStripe value={Object.keys(allStudents).filter((s) => allStudents[s].voted).length / Object.keys(allStudents).length * 100}>  
      </Progress>
      <Grid templateColumns={{ base: '1fr 1fr', }}  w='xl' m='9'>
        <Box>
        { Object.keys(allStudents).sort((a, b) => DateTime.fromISO(allStudents[b].voted) - DateTime.fromISO(allStudents[a].voted)).map((username) => {
        if(allStudents[username].voted) {
          return <Box p={2} m={2}  bg='green.100' w='md' rounded={10} borderColor='green.800' borderWidth={3}><Text bold fontSize='xl'>✅ {allStudents[username].name}</Text><Text>⌛Voted <b>{DateTime.fromISO(allStudents[username].voted).toRelative()}</b></Text></Box>
        }
      } )}    
        </Box>
          <Box>
          { Object.keys(allStudents).map((username) => {
        if(!allStudents[username].voted) {
          return <Box p={2} m={2}  bg='red.100' w='md' rounded={10} borderColor='red.800' borderWidth={3}><Text bold fontSize='xl'>❌ {allStudents[username].name}</Text><Text>⌛Has <b>not </b>voted</Text></Box>
        }
      } )}      
            </Box>    
      
      </Grid>
      </Content>

    </Page>

  )
}

export async function getServerSideProps({ req, params: { eventId } }) {
  const session = await getSession({ req });
  if (!session) {
    return {
      props: {
        loggedIn: false,
      },
    };
  }

  const token = mintToken(session);
  const { result } = await tryAuthenticatedApiQuery(GetAllProjectsAndStudentsQuery, { eventId }, token);
  return {
    props: {
      projects: result?.showcase?.projects,
      loggedIn: true,
    },
  };
}
