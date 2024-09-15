import numpy as np
import praw
import datetime


def scrape_reddit(keyword, subreddits, offset):
    reddit = praw.Reddit(
        client_id='t0GnbzjDWq2BnEKeh4pyjg',
        client_secret= '-vWGpudAnaxqLjfxB28ZwonRyciOxg',
        user_agent='script by /u/YOUR_REDDIT_USERNAME'
    )


    subreddit = reddit.subreddit(subreddits)
    count =0

    now = int(datetime.datetime.utcnow().timestamp())
    yesterday = now - offset

    submissions = subreddit.search(f'title:"{keyword}"', sort='new', time_filter='day')
    
    for submission in submissions:
        if submission.created_utc > yesterday:
            count+=1
            print(f"{submission.title} - {submission.url}")
    return count




def calculate_stock_score(reddit_mentions, news_articles, news_count):

    sentiments = [article['sentiment'][0]*0.45+article['sentiment'][0]*0.2-article['sentiment'][0]*0.35 for article in news_articles]

    avg_sentiment = np.mean(sentiments)

    #news_influence = np.log(len(news_articles) + 1)  
  
    eps = 0.001
    reddit_freq = reddit_mentions[0]/(reddit_mentions[1]+eps)

    #reddit_influence = np.log(reddit_freq + 1)

    
    news_freq = len(sentiments)/(news_count+eps)
    
    final_score = (avg_sentiment * news_freq * 0.7) + (reddit_freq * 0.3) 

    recommendation = final_score

    return final_score, recommendation


subreddits = 'wallstreetbets+trading+stockmarket+investing+tradingreligion'
reddit_keyword = 'nvidia'
day_length = 86400
offset_day = day_length
offset_week = 7*day_length
count_day = scrape_reddit(reddit_keyword, subreddits, offset_day)
count_week = scrape_reddit(reddit_keyword, subreddits, offset_week)

example_reddit_mentions = (count_day, count_week) 

example_news_articles = [
    {'title': 'Apple releases new iPhone', 'sentiment': (0.8, 0.1, 0.1)},
    {'title': 'Apple faces supply chain issues', 'sentiment': (0.1, 0.4, 0.5)},
    {'title': 'Analysts predict strong quarter for Apple', 'sentiment': (0.9, 0.1, 0.0)},
    {'title': 'Apple stock hits new high', 'sentiment': (0.15, 0.7, 0.15)},
]
news_count = 17

final_score, recommendation = calculate_stock_score(example_reddit_mentions, example_news_articles, news_count)

print(final_score)
