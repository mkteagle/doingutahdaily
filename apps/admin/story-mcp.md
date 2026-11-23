# Writing stories for Doing Utah Daily

Write and format stories in Doing Utah Daily admin or co-write them with ChatGPT in the desktop app’s Work/Codex mode. Both editors have a visual toolbar, so you can format a story without learning Markdown.

## Write and format a story in admin

1. Sign in to Doing Utah Daily admin. Open **Stories**, then choose **New story** or open an existing draft from **Drafts**. [Open Stories](https://admin.doingutahdaily.com/posts)
2. Add a title and a short summary. In **Visual** mode, the formatting appears as you write. Use the **Block style** dropdown to choose **Paragraph** or **Heading 2**, **Heading 3**, or **Heading 4**. Highlight text to make it bold, italic, or a link.
3. At the start of a new paragraph, type **/** to open the command menu. Type to find a command, then use the arrow keys and Enter to apply it. Choose **Markdown** to see the source with a live preview.
4. Drafts autosave in admin. Use **Save draft** to save immediately. Review the title, summary, cover photo, and categories before clicking **Publish Now**.

The visual editor saves GitHub Flavored Markdown, which supports ordinary headings, links, and lists as well as tables, checklists, and strikethrough. Older stories that use custom components have an **MDX** source view.

## Co-write a story in ChatGPT

Once the [draft connection](#connect-chatgpt-on-the-editors-computer) is set up, bring your outing notes to a chat. A working title or a few details are enough to start a saved draft.

> Help me write a Doing Utah Daily story about our outing. Ask me one question at a time and start with the opening. Keep my voice, flag details I need to verify, and show me suggested edits before saving them. Open a draft so we can keep working on it here.

1. Work through the story together, one section at a time. Tell ChatGPT which proposed changes to save.
2. When the inline workspace opens, use the visual toolbar in **Write**. **Edit Markdown** opens the source and preview. Click **Save draft** to save your own edits. To work on a passage with ChatGPT, highlight it and click **Revise with AI**.
3. To pick up later, ask ChatGPT to find your Doing Utah Daily draft by title. If the inline workspace is unavailable, keep writing and saving through the conversation. Ask ChatGPT for the admin link if you want to open the draft there.

The connection can reopen drafts started through ChatGPT while they are unpublished and unscheduled. If a draft has newer edits, reopen the latest version and reapply any unsaved changes you want to keep. Publish the finished story from admin.

## Upload a photo into the story

Place the cursor where the photo should appear. Click **Image** in the visual toolbar or type **/image** at the start of a paragraph. Choose a JPEG, PNG, WebP, or AVIF, or enter an existing public **Image URL**. Add a short description in **Alt text**, then click **Insert image**.

When file uploads are configured, you can also paste an image from your clipboard. Click an image in the story to edit its description, replace it, or remove it. **Undo** restores a removed image.

The site stores uploaded files as web-size copies in Cloudflare R2 and strips camera metadata. The public URL works once the upload finishes. Save the draft to keep the photo in its body.

## Upload a cover photo

In admin, open **Post Settings**. In ChatGPT, use the **Cover image** section above the story. Click **Upload cover image** or **Change cover image**, choose a file, and click **Set cover image**. In ChatGPT, click **Save draft** to keep the new cover. Admin autosaves draft covers. For a published story, click **Update**.

Production uses the private `doing-utah-daily-story-images` R2 bucket. The [story image Worker](../../infra/story-images-worker/wrangler.jsonc) serves individual image URLs publicly and accepts uploads from the admin server using a shared secret. Use the Worker’s HTTPS URL for `POST_ASSETS_R2_WORKER_URL` and set `POST_ASSETS_R2_WORKER_TOKEN` to the same value as its `STORY_IMAGES_WRITE_TOKEN` secret. Direct S3 settings are available in the [environment template](../../.env.example) for other deployments.

## Choose photos from Kindred

After the [editorial album is connected](#connect-the-kindred-editorial-album), ask ChatGPT to show photos from the album and compare them with you. You can browse the album or narrow it by photo title or date.

> Show me photos from our Kindred editorial album for this story. Which would work best as the cover? Wait for me to pick one, and suggest a short description for any photo we put in the story.

Choose **Use as cover** or **Add to story** in the photo gallery, or name your choice in chat. For a photo in the story body, confirm a short description of what it shows. The photo is added at the end of the draft, where you can review it before publishing.

Selecting a photo copies a web-size version to Doing Utah Daily’s public image library and strips camera metadata. The image is available by URL as soon as it is copied. It stays available after the Kindred share expires, and the draft stays private until you publish it.

## Connect ChatGPT on the editor’s computer

1. In the Doing Utah Daily admin project’s server environment, set `DUD_MCP_DRAFT_TOKEN` to a random value of at least 32 characters. Deploy admin with the variable configured.
2. On the editor’s computer, make the same value available as `DUD_MCP_DRAFT_TOKEN` in the environment of the desktop Codex process. Keep the token in local secret configuration and out of chat and source control.
3. Register the connection from the editor’s computer, then reopen the desktop app.

   ```sh
   codex mcp add doing-utah-daily \
     --url https://admin.doingutahdaily.com/api/mcp \
     --bearer-token-env-var DUD_MCP_DRAFT_TOKEN
   ```

4. In Work/Codex mode, ask ChatGPT to list your Doing Utah Daily drafts. Open an existing draft or create a test draft to try saving. The inline workspace and photo gallery appear when the client supports MCP Apps.

If the connection is missing, check `codex mcp list` on that computer. If it appears but the server returns an authorization error, check that the desktop process has the same token as the deployed admin project.

## Connect the Kindred editorial album

1. Make a dedicated album in Kindred with photos you are comfortable sharing with ChatGPT and potentially publishing on the site. Create an album share. You can protect it with a password, set an expiration, or revoke it later.
2. Set `KINDRED_EDITORIAL_ALBUM_URL` in the admin server environment to the HTTPS album share link. If the share uses a password, set `KINDRED_EDITORIAL_ALBUM_PASSWORD` too. Use server configuration for both secrets. The admin server needs to be able to reach the Kindred web host.
3. Configure the admin project’s story image storage using the `POST_ASSETS_R2_*` settings above. Deploy admin with these settings and reopen the MCP connection to refresh its tools.
4. Ask ChatGPT to show photos from the album. If it cannot open the album, check that the share points to an album and is still active. If previews work but a selected photo fails to attach, check the admin project’s image storage settings.
