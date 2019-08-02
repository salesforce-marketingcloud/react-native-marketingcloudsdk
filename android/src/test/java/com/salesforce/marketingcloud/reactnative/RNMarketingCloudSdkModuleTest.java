/*
  Copyright 2019 Salesforce, Inc
  <p>
  Redistribution and use in source and binary forms, with or without modification, are permitted
  provided that the following conditions are met:
  <p>
  1. Redistributions of source code must retain the above copyright notice, this list of
  conditions and the following disclaimer.
  <p>
  2. Redistributions in binary form must reproduce the above copyright notice, this list of
  conditions and the following disclaimer in the documentation and/or other materials provided
  with the distribution.
  <p>
  3. Neither the name of the copyright holder nor the names of its contributors may be used to
  endorse or promote products derived from this software without specific prior written permission.
  <p>
  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
  FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
  CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
  WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
  ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
package com.salesforce.marketingcloud.reactnative;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.salesforce.marketingcloud.MCLogListener;
import com.salesforce.marketingcloud.MarketingCloudSdk;
import com.salesforce.marketingcloud.messages.push.PushMessageManager;
import com.salesforce.marketingcloud.registration.RegistrationManager;

import org.hamcrest.CoreMatchers;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InOrder;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.RuntimeEnvironment;
import org.robolectric.annotation.Config;
import org.robolectric.shadows.ShadowLog;
import org.robolectric.shadows.ShadowLog.LogItem;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(RobolectricTestRunner.class)
@Config(shadows = {ShadowMarketingCloudSdk.class, ShadowArguments.class})
public class RNMarketingCloudSdkModuleTest {

    private RNMarketingCloudSdkModule reactModule;

    private MarketingCloudSdk sdk = mock(MarketingCloudSdk.class);
    private PushMessageManager pushMessageManager = mock(PushMessageManager.class);
    private RegistrationManager registrationManager = mock(RegistrationManager.class);
    private RegistrationManager.Editor registrationEditor = mock(RegistrationManager.Editor.class);

    private Promise promise = mock(Promise.class);

    @Before
    public void setUp() {
        reactModule = new RNMarketingCloudSdkModule(new ReactApplicationContext(RuntimeEnvironment.application));

        when(registrationEditor.addTag(anyString())).thenReturn(registrationEditor);
        when(registrationEditor.removeTag(anyString())).thenReturn(registrationEditor);
        when(registrationEditor.setAttribute(anyString(), anyString())).thenReturn(registrationEditor);
        when(registrationEditor.clearAttribute(anyString())).thenReturn(registrationEditor);
        when(registrationEditor.setContactKey(anyString())).thenReturn(registrationEditor);

        when(registrationManager.edit()).thenReturn(registrationEditor);

        when(sdk.getPushMessageManager()).thenReturn(pushMessageManager);
        when(sdk.getRegistrationManager()).thenReturn(registrationManager);

        ShadowMarketingCloudSdk.setInstance(sdk);
    }

    @After
    public void tearDown() {
        reset(sdk, pushMessageManager, registrationEditor, registrationManager, promise);
        ShadowMarketingCloudSdk.reset();
    }

    @Test
    public void isPushEnabled() {
        // GIVEN
        ShadowMarketingCloudSdk.isReady(true);
        when(pushMessageManager.isPushEnabled()).thenReturn(true);

        // WHEN
        reactModule.isPushEnabled(promise);

        // THEN
        verify(pushMessageManager).isPushEnabled();
        verify(promise).resolve(true);
    }

    @Test
    public void enablePush() {
        // GIVEN
        ShadowMarketingCloudSdk.isReady(true);

        // WHEN
        reactModule.enablePush();

        // THEN
        verify(pushMessageManager).enablePush();
    }

    @Test
    public void disablePush() {
        // GIVEN
        ShadowMarketingCloudSdk.isReady(true);

        // WHEN
        reactModule.disablePush();

        // THEN
        verify(pushMessageManager).disablePush();
    }

    @Test
    public void getSystemToken() {
        // GIVEN
        ShadowMarketingCloudSdk.isReady(true);
        when(pushMessageManager.getPushToken()).thenReturn("token");

        // WHEN
        reactModule.getSystemToken(promise);

        // THEN
        verify(pushMessageManager).getPushToken();
        verify(promise).resolve("token");
    }

    @Test
    public void getAttributes() {
        // GIVEN
        ShadowMarketingCloudSdk.isReady(true);
        Map<String, String> attrs = Collections.singletonMap("Name", "Tester");
        when(registrationManager.getAttributes()).thenReturn(attrs);

        // WHEN
        reactModule.getAttributes(promise);

        // THEN
        verify(registrationManager).getAttributes();
        ArgumentCaptor<ShadowArguments.TestWritableMap> mapCaptor = ArgumentCaptor.forClass(ShadowArguments.TestWritableMap.class);
        verify(promise).resolve(mapCaptor.capture());
        ShadowArguments.TestWritableMap map = mapCaptor.getValue();
        assertEquals("Tester", map.getString("Name"));

    }

    @Test
    public void setAttribute() {
        // GIVEN
        ShadowMarketingCloudSdk.isReady(true);
        when(registrationEditor.commit()).thenReturn(true);

        // WHEN
        reactModule.setAttribute("Name", "Tester");

        // THEN
        InOrder order = inOrder(registrationEditor);
        order.verify(registrationEditor).setAttribute("Name", "Tester");
        order.verify(registrationEditor).commit();
    }

    @Test
    public void clearAttribute() {
        // GIVEN
        ShadowMarketingCloudSdk.isReady(true);
        when(registrationEditor.commit()).thenReturn(true);

        // WHEN
        reactModule.clearAttribute("Name");

        // THEN
        InOrder order = inOrder(registrationEditor);
        order.verify(registrationEditor).clearAttribute("Name");
        order.verify(registrationEditor).commit();
    }

    @Test
    public void addTag() {
        // GIVEN
        ShadowMarketingCloudSdk.isReady(true);
        when(registrationEditor.commit()).thenReturn(true);

        // WHEN
        reactModule.addTag("Testing");

        // THEN
        InOrder order = inOrder(registrationEditor);
        order.verify(registrationEditor).addTag("Testing");
        order.verify(registrationEditor).commit();
    }

    @Test
    public void removeTag() {
        // GIVEN
        ShadowMarketingCloudSdk.isReady(true);
        when(registrationEditor.commit()).thenReturn(true);

        // WHEN
        reactModule.removeTag("Testing");

        // THEN
        InOrder order = inOrder(registrationEditor);
        order.verify(registrationEditor).removeTag("Testing");
        order.verify(registrationEditor).commit();
    }

    @Test
    public void getTags() {
        // GIVEN
        ShadowMarketingCloudSdk.isReady(true);
        Set<String> tags = Collections.singleton("Testing");
        when(registrationManager.getTags()).thenReturn(tags);

        // WHEN
        reactModule.getTags(promise);

        // THEN
        verify(registrationManager).getTags();
        ArgumentCaptor<ShadowArguments.TestWritableArray> arrCaptor = ArgumentCaptor.forClass(ShadowArguments.TestWritableArray.class);
        verify(promise).resolve(arrCaptor.capture());
        ShadowArguments.TestWritableArray arr = arrCaptor.getValue();
        assertEquals(1, arr.size());
        assertEquals("Testing", arr.getString(0));
    }

    @Test
    public void setContactKey() {
        // GIVEN
        ShadowMarketingCloudSdk.isReady(true);
        when(registrationEditor.commit()).thenReturn(true);

        // WHEN
        reactModule.setContactKey("test@salesforce.com");

        // THEN
        InOrder order = inOrder(registrationEditor);
        order.verify(registrationEditor).setContactKey("test@salesforce.com");
        order.verify(registrationEditor).commit();
    }

    @Test
    public void getContactKey() {
        // GIVEN
        ShadowMarketingCloudSdk.isReady(true);
        when(registrationManager.getContactKey()).thenReturn("test@salesforce.com");

        // WHEN
        reactModule.getContactKey(promise);

        // THEN
        verify(registrationManager).getContactKey();
        verify(promise).resolve("test@salesforce.com");
    }

    @Test
    public void enableVerboseLogging() {
        // GIVEN
        ShadowMarketingCloudSdk.isReady(true);

        // WHEN
        reactModule.enableVerboseLogging();

        // THEN
        assertEquals(MCLogListener.VERBOSE, ShadowMarketingCloudSdk.getLogLevel());
        assertThat(ShadowMarketingCloudSdk.getLogListener(), CoreMatchers.<MCLogListener>instanceOf(MCLogListener.AndroidLogListener.class));
    }

    @Test
    public void disableVerboseLogging() {
        // GIVEN
        ShadowMarketingCloudSdk.isReady(true);
        ShadowMarketingCloudSdk.setLogListener(new MCLogListener.AndroidLogListener());

        // WHEN
        reactModule.disableVerboseLogging();

        // THEN
        assertNull(ShadowMarketingCloudSdk.getLogListener());
    }

    @Test
    public void logSdkState() throws JSONException {
        // GIVEN
        ShadowMarketingCloudSdk.isReady(true);
        JSONObject state = new JSONObject("{\"state\":1}");
        when(sdk.getSdkState()).thenReturn(state);

        // WHEN
        reactModule.logSdkState();

        // THEN
        List<LogItem> logs = ShadowLog.getLogsForTag("MCSDK STATE");
        assertEquals(1, logs.size());
    }
}