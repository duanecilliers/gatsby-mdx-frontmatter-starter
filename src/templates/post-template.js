import React from 'react'
import { Link } from 'gatsby'
import { MDXProvider } from '@mdx-js/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'

import Layout from '../components/layout'
import SEO from '../components/seo'
import Button from '../components/button'

const shortcodes = { Link, Button }

export default function PostTemplate({ data: { mdx } }) {
  const { title, items } = mdx.frontmatter

  return (
    <MDXProvider components={shortcodes}>
      <Layout>
        <SEO title={title} />
        <h1>{title}</h1>
          {items && (
            <>
              <h2>Items from frontmatter. Each item contains MDX.</h2>
              <ul>
                {
                  items.map(item => (
                    <li key={item.value}>
                      <MDXRenderer>{item.value}</MDXRenderer>
                    </li>
                  ))
                }
              </ul>
            </>
          )}

        <MDXRenderer>{mdx.body}</MDXRenderer>
      </Layout>
    </MDXProvider>
  )
}

export const pageQuery = graphql`
  query BlogPostQuery($id: String) {
    mdx(id: { eq: $id }) {
      id
      body
      frontmatter {
        title,
        items {
          value
        }
      }
    }
  }
`
