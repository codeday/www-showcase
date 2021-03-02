import React, { useState } from 'react';
import { DefaultSeo } from 'next-seo';
import { signIn, signOut, useSession } from 'next-auth/client';
import Box, { Flex } from '@codeday/topo/Atom/Box';
import Skelly from '@codeday/topo/Atom/Skelly';
import Text, { Link } from '@codeday/topo/Atom/Text';
import Header, { SiteLogo, Menu } from '@codeday/topo/Organism/Header';
import Input from '@codeday/topo/Atom/Input/Text';
import Footer, { CustomLinks } from '@codeday/topo/Organism/Footer';
import { CodeDay } from '@codeday/topo/Atom/Logo';
import Button from '@codeday/topo/Atom/Button';

import UiSearch from '@codeday/topocons/Icon/UiSearch';

export default function Page({
  children, title, darkHeader, slug, ...props
}) {
  const [session, loading] = useSession();

  const [search, setSearch] = useState();
  const menuItems = (
    <Menu d="inline-flex">
      <form onSubmit={(e) => {
        e.preventDefault();
        if (search) {
          // eslint-disable-next-line no-undef
          window.location.href = `/all/1/contains=${search}`;
        }
      }}
      >
        <Box d="flex">
          <Input placeholder="Search Projects" value={search} onChange={(e) => setSearch(e.target.value)} mr={-4} />
          <Button size="md" fontSize="xl" type="submit">
            <UiSearch style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            />
          </Button>
        </Box>
      </form>
      {!session
        ? (<Button variant="ghost" variantColor="brand" onClick={() => signIn('auth0')}>Log In</Button>)
        : (
          <>
            <Button variant="ghost" key="mine" as="a" href="/mine">My Projects</Button>
            <Button variant="ghost" key="create" as="a" href="/create">New Project</Button>
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
          </SiteLogo>
          <Menu>
            {loading ? <Skelly /> : menuItems}
          </Menu>
        </Header>
        {children}
        <Box mb={16} />
        <Footer>
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
