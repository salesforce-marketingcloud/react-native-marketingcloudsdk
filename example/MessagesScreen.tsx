import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface InboxMessage {
  id: string;
  subject: string | null;
  alert: string | null;
  url: string;
  sendDateUtc: string | null;
  read: boolean;
  deleted: boolean;
}

const dummyInboxMessages: InboxMessage[] = [
  {
    id: '1',
    subject: 'Welcome to Our Service!',
    message: 'Your account has been successfully created.',
    url: 'https://example.com/welcome',
    sendDateUtc: '2023-12-01T10:00:00Z',
    read: false,
    deleted: false,
  },
  {
    id: '2',
    subject: 'New Feature Announcement',
    message: 'Check out our latest feature now available in the app!',
    url: 'https://example.com/features',
    sendDateUtc: '2023-12-02T15:30:00Z',
    read: true,
    deleted: false,
  },
  {
    id: '3',
    subject: 'Important Security Update',
    message: 'Please update your password to ensure your account remains secure.',
    url: 'https://example.com/security-update',
    sendDateUtc: '2023-11-25T08:45:00Z',
    read: false,
    deleted: false,
  },
  {
    id: '4',
    subject: 'Account Deactivation Reminder',
    message: 'Your account will be deactivated if not used within 30 days.',
    url: 'https://example.com/deactivation',
    sendDateUtc: '2023-11-20T09:20:00Z',
    read: true,
    deleted: true,
  },
  {
    id: '5',
    subject: 'Exclusive Offer for You',
    message: 'Enjoy 50% off on your next purchase!',
    url: 'https://example.com/offers',
    sendDateUtc: '2023-12-03T12:00:00Z',
    read: false,
    deleted: false,
  },
];


const sdk = {
  getMessages: () => dummyInboxMessages,
  deleteAllMessages: async () => console.log('All messages deleted'),
  markAllMessagesRead: async (): InboxMessage[] => {
    return dummyInboxMessages.map((message) => ({
      ...message,
      read: 1,
    }));
  },
};

const MessageScreen = ({ navigation }: { navigation: any }) => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<InboxMessage[]>([]);
  const [messageCounts, setMessageCounts] = useState({
    all: 0,
    read: 0,
    unread: 0,
    deleted: 0,
  });

  const filterMessages = (type: string) => {
    let filtered = messages;
    if (type === 'read') filtered = messages.filter((msg) => msg.read);
    if (type === 'unread') filtered = messages.filter((msg) => !msg.read);
    if (type === 'deleted') filtered = messages.filter((msg) => msg.deleted);
    console.log(type, 'Filtered Messages: ', filtered);
    setFilteredMessages(filtered || []);
    setSelectedTab(type);
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerIcons}>
          <TouchableOpacity
            onPress={() => handleDeleteAll()}
            style={{ marginRight: 10 }}>
            <Icon name="delete-sweep" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleMarkAllRead()}
            style={{ marginRight: 10 }}>
            <Icon name="email-check" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const allMessages = await sdk.getMessages();
        const readMessages = allMessages.filter((msg: InboxMessage) => msg.read);
        const unreadMessages = allMessages.filter((msg: InboxMessage) => !msg.read);
        const deletedMessages = allMessages.filter((msg: InboxMessage) => msg.deleted);

        setMessages(allMessages);
        setFilteredMessages(allMessages);
        setMessageCounts({
          all: allMessages.length,
          read: readMessages.length,
          unread: unreadMessages.length,
          deleted: deletedMessages.length,
        });
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();
  }, []);

  const handleDeleteAll = async () => {
    await sdk.deleteAllMessages();
  };

  const handleMarkAllRead = async () => {
    await sdk.markAllMessagesRead();
  };

  // InboxMessage card
  const renderMessageCard = ({ item }: { item: InboxMessage }) => {
    if (!item) return null;
  
    return (
      <Card style={styles.card}>
        <Card.Content>
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <Icon name="email-outline" size={24} color={item.read ? 'green' : 'red'} />
            <Title style={styles.cardTitle}>{item.subject || 'No Subject'}</Title>
          </View>
  
          {/* Message Body */}
          <Paragraph style={styles.messageText}>
            {item.message || 'No message available.'}
          </Paragraph>
  
          {/* Footer */}
          <View style={styles.cardFooter}>
            <Icon name="clock-outline" size={18} color="gray" />
            <Text style={styles.dateText}>
              {item.sendDateUtc || 'Unknown date'}
            </Text>
          </View>
        </Card.Content>
  
        {/* Actions */}
        <Card.Actions style={styles.cardActions}>
          <TouchableOpacity onPress={() => handleMarkAsRead(item.id)}>
            <Icon
              name="email-check-outline"
              size={24}
              color={item.read ? 'green' : 'gray'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteMessage(item.id)}>
            <Icon name="delete-outline" size={24} color="gray" />
          </TouchableOpacity>
        </Card.Actions>
      </Card>
    );
  };
  

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        {['all', 'read', 'unread', 'deleted'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.tab, selectedTab === type && styles.activeTab]}
            onPress={() => filterMessages(type)}
          >
            <Text style={[styles.tabText, selectedTab === type && styles.activeTabText]}>
              {type.charAt(0).toUpperCase() + type.slice(1)} ({messageCounts[type] || 0})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Message List */}
      <FlatList
        data={filteredMessages}
        renderItem={renderMessageCard}
        keyExtractor={(item, index) => item?.id || index.toString()}
        contentContainerStyle={styles.listContainer}
      />
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
});

export default MessageScreen;
