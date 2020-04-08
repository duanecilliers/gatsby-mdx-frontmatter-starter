const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

exports.createPages = async ({ graphql, actions, reporter }) => {
  // Destructure the createPage function from the actions object
  const { createPage } = actions
  const result = await graphql(`
    query {
      allMdx {
        edges {
          node {
            id
            fields {
              slug
            }
          }
        }
      }
    }
  `)
  if (result.errors) {
    reporter.panicOnBuild('🚨  ERROR: Loading "createPages" query')
  }
  // Create blog post pages.
  const posts = result.data.allMdx.edges
  // you'll call `createPage` for each result
  posts.forEach(({ node }, index) => {
    createPage({
      // This is the slug you created before
      // (or `node.frontmatter.slug`)
      path: node.fields.slug,
      // This component will wrap our MDX content
      component: path.resolve(`./src/templates/post-template.js`),
      // You can use the values in this context in
      // our page layout component
      context: { id: node.id },
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  // you only want to operate on `Mdx` nodes. If you had content from a
  // remote CMS you could also check to see if the parent node was a
  // `File` node here
  if (node.internal.type === "Mdx") {
    const value = createFilePath({ node, getNode })
    createNodeField({
      // Name of the field you are adding
      name: "slug",
      // Individual MDX node
      node,
      // Generated value based on filepath with "blog" prefix. you
      // don't need a separating "/" before the value because
      // createFilePath returns a path with the leading "/".
      value: `/posts${value}`,
    })
  }
}

/**
 * Update GraphQL schema to support MDX fields in frontmatter
 * @link https://zslabs.com/articles/mdx-frontmatter-in-gatsby
 */
exports.createSchemaCustomization = ({
  actions: { createTypes, createFieldExtension },
  createContentDigest,
}) => {
  createFieldExtension({
    name: 'mdx',
    extend() {
      return {
        type: 'String',
        resolve(source, args, context, info) {
          // Grab field
          const value = source[info.fieldName]
          // Isolate MDX
          const mdxType = info.schema.getType('Mdx')
          // Grab just the body contents of what MDX generates
          const { resolve } = mdxType.getFields().body
          return resolve({
            rawBody: value,
            internal: {
              contentDigest: createContentDigest(value), // Used for caching
            },
          })
        },
      }
    },
  })
  createTypes(`
    type Mdx implements Node {
      frontmatter: MdxFrontmatter
    }
    type MdxFrontmatter {
      items: [ItemValues]
    }
    type ItemValues {
      value: String @mdx
    }
  `)
}
