import { c, COLUMN, mono } from './theme';
import { Icon } from './Icon';
import { Card, Button, Pill } from './ui';

// The Review tab (redesign R04): how many questions are due today, and the button that starts the daily review.
// R13 gives this screen its full "drive test" look; for now it's built from the building blocks.
export function ReviewScreen({ due, onStart }: { due: number; onStart: () => void }) {
  return (
    <div data-testid="review-screen" style={{ maxWidth: COLUMN, margin: '0 auto', padding: '16px 20px 32px', boxSizing: 'border-box' }}>
      <h1 style={{ margin: '0 0 12px' }}>Daily review</h1>
      <Card raised style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <Icon name="repeat" size={28} style={{ color: c.review }} />
          <div style={{ flex: 1 }}>
            <div data-testid="review-count" style={{ fontSize: 18, fontWeight: 700 }}>{due ? <><span style={mono}>{due}</span> {due === 1 ? 'question' : 'questions'} due</> : 'Nothing due today'}</div>
            <div style={{ fontSize: 14, color: c.textMuted }}>{due ? 'About 10 minutes at most.' : 'Come back tomorrow, or play a new lesson.'}</div>
          </div>
          {due > 0 && <Pill tone="review">{due} due</Pill>}
        </div>
        <Button full big icon="repeat" data-testid="review-start" disabled={!due} onClick={onStart}>Start the review</Button>
      </Card>
      <Card title="How it works">
        <p style={{ margin: 0, fontSize: 15, color: c.textMuted }}>
          Questions you have answered before come back just before you would forget them. You get the oldest ones first, at most 20.
          A review counts for your streak and your XP.
        </p>
      </Card>
    </div>
  );
}
