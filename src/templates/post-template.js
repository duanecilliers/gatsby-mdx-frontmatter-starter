import React from 'react'
import { Link } from 'gatsby'
import { MDXProvider } from '@mdx-js/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'

import Layout from '../components/layout'
// import Image from '../components/image'
// import SEO from '../components/seo'
import Button from '../components/button'

const shortcodes = { Link, Button }

export default function PostTemplate({ data: { mdx } }) {
  return (
    <Layout>
      {/* <SEO title='Home' /> */}
      <h1>{mdx.frontmatter.title}</h1>
      <MDXProvider components={shortcodes}>
        <MDXRenderer>{mdx.body}</MDXRenderer>
      </MDXProvider>
    </Layout>
  )
}

export const pageQuery = graphql`
  query BlogPostQuery($id: String) {
    mdx(id: { eq: $id }) {
      id
      body
      frontmatter {
        title
      }
    }
  }
`
