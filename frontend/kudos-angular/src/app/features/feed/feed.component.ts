import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-feed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="feed-placeholder">
      <h1>Kudos Feed</h1>
      <p>Feed component placeholder.</p>
    </main>
  `,
  styles: [
    `
      .feed-placeholder {
        min-height: 100dvh;
        display: grid;
        place-content: center;
        text-align: center;
        gap: 0.5rem;
      }

      h1,
      p {
        margin: 0;
      }
    `
  ]
})
export class FeedComponent {}
