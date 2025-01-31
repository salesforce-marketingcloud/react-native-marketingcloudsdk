import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, NativeEventEmitter, NativeModules, Linking } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MCReactModule from 'react-native-marketingcloudsdk';

const { RNSFMCSdk } = NativeModules;
const eventEmitter = new NativeEventEmitter(RNSFMCSdk);

interface InboxMessage {
  id: string;
  subject: string | null;
  alert: string | null;
  url: string;
  sendDateUtc: string | null;
  read: boolean;
  deleted: boolean;
}

const MessageScreen = ({ navigation }: { navigation: any }) => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [messageCounts, setMessageCounts] = useState({
    all: 0,
    read: 0,
    unread: 0,
    deleted: 0,
  });

  const messageFetchers = {
    all: () => MCReactModule.getMessages(),
    read: () => MCReactModule.getReadMessages(),
    unread: () => MCReactModule.getUnreadMessages(),
    deleted: () => MCReactModule.getDeletedMessages(),
  };

  const updateMessageCounts = useCallback(async () => {
    try {
      const counts = await Promise.all([
        MCReactModule.getMessageCount(),
        MCReactModule.getReadMessageCount(),
        MCReactModule.getUnreadMessageCount(),
        MCReactModule.getDeletedMessageCount(),
      ]);
      setMessageCounts({
        all: counts[0],
        read: counts[1],
        unread: counts[2],
        deleted: counts[3],
      });
    } catch (error) {
      console.error('Failed to fetch message counts:', error);
    }
  }, []);

  const fetchMessages = useCallback(async (type: string) => {
    try {
      const fetcher = messageFetchers[type];
      if (!fetcher) {
        throw new Error(`Invalid message type: ${type}`);
      }
      const fetchedMessages = await fetcher();
      setMessages(fetchedMessages);
    } catch (error) {
      console.error(`Failed to fetch ${type} messages:`, error);
    }
  }, []);

  const handleAction = useCallback(
    async (action: Function, messageId?: string) => {
      try {
        if (messageId) {
          await action(messageId);
        } else {
          await action();
        }
        await updateMessageCounts();
        await fetchMessages(selectedTab); // Refresh messages for the selected tab
      } catch (error) {
        console.error('Action failed:', error);
      }
    },
    [selectedTab, updateMessageCounts, fetchMessages]
  );

  const handleInboxMessageChanged = async (_messages) => {
    await updateMessageCounts();
    await fetchMessages(selectedTab);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerIcons}>
          <TouchableOpacity
            onPress={() => handleAction(MCReactModule.markAllMessagesDeleted)}
            style={{ marginRight: 10 }}
          >
            <Icon name="delete-sweep" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleAction(MCReactModule.markAllMessagesRead)}
            style={{ marginRight: 10 }}
          >
            <Icon name="email-check" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleAction(MCReactModule.refreshInbox)}
            style={{ marginRight: 10 }}
          >
            <Icon name="refresh" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, selectedTab, handleAction]);

  useEffect(() => {
    (async () => {
      MCReactModule.registerInboxResponseListener();
      const subscription = eventEmitter.addListener('onInboxMessagesChanged', handleInboxMessageChanged);

      await updateMessageCounts();
      await fetchMessages('all');

      return () => {
        subscription.remove(); // Cleanup listener when the component unmounts
      };
    })();
  }, []);

  const openUrl = async (url) => {
    if (!url) {
      console.warn('No URL provided for this message');
      return;
    }
    const encodedUrl = encodeURI(url);
    Linking.openURL(encodedUrl).catch((err) => console.error('Error in openURL:', err));
  };

  const renderMessageCard = ({ item }: { item: InboxMessage }) => {
    if (!item) return null;

    return (
      <TouchableOpacity onPress={() => openUrl(item.url)}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Icon name="email-outline" size={24} color={item.read ? 'green' : 'red'} />
              <Title style={styles.cardTitle}>{item.subject || 'No Subject'}</Title>
            </View>
            <Paragraph style={styles.messageText}>
              {item.alert || 'No message available.'}
            </Paragraph>
            <View style={styles.cardFooter}>
              <Icon name="clock-outline" size={18} color="gray" />
              <Text style={styles.dateText}>{item.sendDateUtc || 'Unknown date'}</Text>
            </View>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <TouchableOpacity onPress={() => handleAction(MCReactModule.setMessageRead, item.id)}>
              <Icon name="email-check-outline" size={24} color={item.read ? 'green' : 'gray'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleAction(MCReactModule.deleteMessage, item.id)}>
              <Icon name="delete-outline" size={24} color="gray" />
            </TouchableOpacity>
          </Card.Actions>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {['all', 'read', 'unread', 'deleted'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.tab, selectedTab === type && styles.activeTab]}
            onPress={() => {
              setSelectedTab(type);
              fetchMessages(type);
            }}
          >
            <Text style={[styles.tabText, selectedTab === type && styles.activeTabText]}>
              {type.charAt(0).toUpperCase() + type.slice(1)} ({messageCounts[type] || 0})
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {messages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No messages available</Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          renderItem={renderMessageCard}
          keyExtractor={(item) => item?.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
  },
  tab: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  tabText: {
    color: 'white',
    fontSize: 16,
  },
  activeTab: {
    backgroundColor: 'white',
    borderRadius: 20,
  },
  activeTabText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 10,
  },
  card: {
    marginBottom: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    marginLeft: 10,
    fontWeight: 'bold',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  dateText: {
    marginLeft: 5,
    color: 'gray',
    fontSize: 14,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  headerIcons: {
    flexDirection: 'row',
    marginRight: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MessageScreen;
