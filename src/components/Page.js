import React, { useState } from 'react';
import { DefaultSeo } from 'next-seo';
import { signIn, signOut, useSession } from 'next-auth/client';
import {
  Box, Button, CodeDay, Link, Skelly, Text
} from '@codeday/topo/Atom';
import {
  CustomLinks, Footer, Header, Menu, SiteLogo,
} from '@codeday/topo/Organism';


export default function Page({
  children, title, darkHeader, slug, ...props
}) {
  const [session, loading] = useSession();

  const menuItems = (
    <Menu d="inline-flex">
      {!session
        ? (<Button variant="ghost" r="brand" onClick={() => signIn('auth0')}>Log In</Button>)
        : (
          <>
            <Button variant="ghost" key="mine" as="a" href="/mine">{session?.user?.nickname}'s Projects</Button>
            <Button variant="ghost" key="create" as="a" href="/create">Join/New Project</Button>
          </>
        )}
    </Menu>
  );

  return (
    <>
      <DefaultSeo
        title={`${title ? `${title} ~ ` : ''}CodeDay Showcase`}
        description="See the amazing projects created by CodeDay students!"
        canonical={`https://showcase.codeday.org${slug}`}
        openGraph={{
          type: 'website',
          locale: 'en_US',
          site_name: 'CodeDay Showcase',
          url: `https://showcase.codeday.org${slug}`,
        }}
        twitter={{
          handle: '@codeday',
          site: '@codeday',
          cardType: 'summary_large_image',
        }}
      />
      <Box position="relative" {...props}>
        <Header
          darkBackground={darkHeader}
          gradAmount={darkHeader && 'lg'}
          underscore
          position="relative"
          zIndex="1000"
          role="banner"
        >
          <SiteLogo>
            <a href="https://www.codeday.org/">
              <CodeDay withText />
            </a>
            <a href="/">
              <Text
                as="span"
                d="inline"
                letterSpacing="-2px"
                fontFamily="heading"
                position="relative"
                top={1}
                ml={1}
                textDecoration="underline"
                bold
              >
                Showcase
              </Text>
            </a>
            {session?.user?.nickname && (
              <Text mt={4} fontSize="sm">
                Your username is:{' '}
                <Text display="inline" fontFamily="monospace" textStyle="italic" fontWeight="bold">{session.user.nickname}</Text>
              </Text>
            )}
          </SiteLogo>
          <Menu>
            {loading ? <Skelly /> : menuItems}
          </Menu>
        </Header>
        {children}
        <Box mb={16} />
        <Footer mt={16} repository="www-showcase" branch="main">
          {session && (
            <CustomLinks>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <Link onClick={signOut}>Log Out</Link>
            </CustomLinks>
          )}
        </Footer>
      </Box>
    </>
  );
}
